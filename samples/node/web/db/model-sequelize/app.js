const model = require('./model');

let
    Pet = model.Pet,
    User = model.User;

(async () => {
    var user = await User.create({
        name: 'John',
        gender: false,
        email: 'john-' + Date.now() + '@garfield.pet',
        passwd: 'hahaha'
    });
    console.log('created: ' + JSON.stringify(user));
    var cat = await Pet.create({
        ownerId: user.id,
        name: 'Garfield',
        gender: false,
        birth: '2007-07-07',
    });
    console.log('created: ' + JSON.stringify(cat));
    var dog = await Pet.create({
        ownerId: user.id,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
    });
    console.log('created: ' + JSON.stringify(dog));
})();

(async () => {
//     try {
//         var pets = await Pet.findAll();// 这里得到了一个返回错误
//     } catch (err) {
//         console.log(err); // 这里捕捉到错误 `error`
//         return;
//     }

    var pets = await Pet.findAll();
    for(var i=0; i< pets.length; i++) {
        var pet = pets[i];
        console.log("sqlQueryResult >>> " + JSON.stringify(pet));
    }

})();
