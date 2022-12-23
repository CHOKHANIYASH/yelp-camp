
const env = require('../.env')
const mongoose=require('mongoose')
const cities = require("./cities")
const {places,descriptors} = require('./seedHelpers')
const Campground=require('../models/campground')
const dbUrl = process.env.DB_URL 
mongoose.connect(dbUrl).then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

    const sample = array => array[Math.floor(Math.random() * array.length)];


    const seedDB = async () => {
        await Campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10;
            const camp = new Campground({
                author:'636643e9d7c5f5c3a9c701b8',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image:'https://source.unsplash.com/collection/483251',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
                price

            })
            await camp.save();
        }
    }
seedDB().then(()=>{
    mongoose.connection.close()
});   