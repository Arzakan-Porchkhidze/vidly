const mongoose = require('mongoose');
const express = require('express');
const {validate, Rental} = require('../models/rental');
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const router = express.Router();

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('name');
    res.send(rentals);
});

router.get('/:id', async(req, res) => {
    try{
        const rental = await Rental.findById(req.params.id);
        res.send(rental);
    }
    catch {
        return res.status(404).send('The rental with the given ID was not found.');
    }
        
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try{
        const customer = await Customer.findById(req.body.customerId);
        try{
            const movie = await Movie.findById(req.body.movieId);
            if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

            let rental = new Rental({ 
                customer: {
                  _id: customer._id,
                  name: customer.name, 
                  phone: customer.phone
                },
                movie: {
                  _id: movie._id,
                  title: movie.title,
                  dailyRentalRate: movie.dailyRentalRate
                }
              });
              rental = await rental.save();
            
              movie.numberInStock--;
              movie.save();
              
              res.send(rental);
        }catch{
            return res.status(400).send('Invalid movie.');
        }
    }catch{
        return res.status(400).send('Invalid customer.');
    }
});

module.exports = router;