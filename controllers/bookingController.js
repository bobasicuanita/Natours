const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');
const Booking = require('../models/bookingModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour

    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourId
        }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `https://www.natours.dev/img/tours/${tour.imageCover}`
                ],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1
            }
        ]
    });

    // 3) create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // this is only temporary, because it is insecure. everyone can make bookings without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

// exports.getAllBookings = catchAsync(async (req, res, next) => {
//     const bookings = await Booking.find();

//     res.status(200).json({
//         status: 'success',
//         bookings
//     });
// });

// exports.createBooking = catchAsync(async (req, res, next) => {
//     const newBooking = await Booking.create(req.body);

//     res.status(200).json({
//         status: 'success',
//         newBooking
//     });
// });

// exports.updateBooking = catchAsync(async (req, res, next) => {
//     const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, {
//         tour: req.body.tour,
//         user: req.body.user
//     });

//     res.status(200).json({
//         status: 'success',
//         updatedBooking
//     });
// });

// exports.deleteBooking = catchAsync(async (req, res, next) => {
//     await Booking.deleteOne(req.params.id);

//     res.status(204).json({
//         status: 'success'
//     });
// });

exports.getAllBookings = factory.getAll(Booking);

exports.getBooking = factory.getOne(Booking);

exports.createBooking = factory.createOne(Booking);

exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = factory.deleteOne(Booking);
