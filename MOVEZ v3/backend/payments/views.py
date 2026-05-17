import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse
from reservations.models import Reservation

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        reservation_id = request.data.get('reservation_id')
        try:
            reservation = Reservation.objects.get(id=reservation_id, player=request.user)
        except Reservation.DoesNotExist:
            return Response({"error": "Réservation introuvable."}, status=status.HTTP_404_NOT_FOUND)

        if reservation.is_paid:
            return Response({"error": "Cette réservation est déjà payée."}, status=status.HTTP_400_BAD_REQUEST)

        # In a real app, URL should come from frontend env
        frontend_url = "http://localhost:5173"

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'mad', # Dirhams
                        'unit_amount': int(reservation.total_price * 100), # amount in cents
                        'product_data': {
                            'name': f'Réservation {reservation.get_reservation_type_display()} - {reservation.date}',
                        },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=frontend_url + f'/dashboard?payment=success&res={reservation.id}',
                cancel_url=frontend_url + f'/dashboard?payment=cancelled&res={reservation.id}',
                metadata={
                    'reservation_id': reservation.id
                }
            )
            return Response({"checkout_url": checkout_session.url})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StripeWebhookView(APIView):
    permission_classes = [AllowAny] # Stripe webhook has no auth

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return HttpResponse(status=400)

        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            reservation_id = session.get('metadata', {}).get('reservation_id')
            payment_intent = session.get('payment_intent')
            
            if reservation_id:
                try:
                    reservation = Reservation.objects.get(id=reservation_id)
                    reservation.is_paid = True
                    reservation.payment_reference = payment_intent
                    reservation.status = 'CONFIRMED'
                    reservation.save()
                except Reservation.DoesNotExist:
                    pass

        return HttpResponse(status=200)
