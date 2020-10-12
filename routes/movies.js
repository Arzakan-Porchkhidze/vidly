const mongoose = require('mongoose');
const express = require('express');
const {validate, Movie} = require('../models/movie');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.get('/:id', async(req, res) => {
    try{
        const movie = await Movie.findById(req.params.id);
        res.send(movie);
    }
    catch {
        return res.status(404).send('The movie with the given ID was not found.');
    }
        
  });

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try{
        const genre = Genre.findById(req.body.id);
        let movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
        });
        movie = await movie.save()
        res.send(movie);
    }catch{
        return res.status(400).send('Invalid genre.');
    }
})

router.put('/:id', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try{
        const genre = await Genre.findById(req.body.genreId);
        const movie = await Movie.findByIdAndUpdate(req.params.id,
            { 
              title: req.body.title,
              genre: {
                _id: genre._id,
                name: genre.name
              },
              numberInStock: req.body.numberInStock,
              dailyRentalRate: req.body.dailyRentalRate
            }, { new: true });
        res.send(movie);
    }
    catch(genre){
        return res.status(404).send('Invalid genre.')
    }catch{
        return res.status(404).send('The movie with the given ID was not found.');
    }
});

router.delete('/:id', async(req, res) => {
    try{
        const movie = await Movie.findByIdAndRemove(req.params.id);
        res.send(movie);
    }
    catch{
        return res.status(404).send('The customer with the given ID was not found.');
    } 
})

module.exports = router;