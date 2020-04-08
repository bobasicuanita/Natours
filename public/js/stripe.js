import Axios from 'axios';

const stripe = Stripe('pk_test_Jkpfl48vYkYMC0k9JXbzoHTG00MYFBzsaz');

export const bookTour = async tourId => {
    try {
        // 1) Get session from the server
        const session = await Axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );

        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
