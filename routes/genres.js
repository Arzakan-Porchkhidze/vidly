const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const {validate, Genre} = require('../models/genre');
const admin = require('../middleware/admin');
const router = express.Router();


router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async(req, res) => {
    try{
        const genre = await Genre.findById(req.params.id);
        res.send(genre);
    }
    catch {
        return res.status(404).send('The genre with the given ID was not found.');
    }
        
  });

router.post('/',auth, async(req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save()
    res.send(genre);
})

router.put('/:id',auth, async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try{
        const genre =  await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, { new: true});
        res.send(genre);
    }
    catch{
         return res.status(404).send("The genre with the given ID was not found.")
    }
});

router.delete('/:id',[auth, admin], async(req, res) => {
    try{
        const genre = await Genre.findByIdAndRemove(req.params.id);
        res.send(genre);
    }
    catch{
        return res.status(404).send('The customer with the given ID was not found.');
    } 
})

module.exports = router;