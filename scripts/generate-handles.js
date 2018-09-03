var fs = require('fs');
var _ = require('lodash');
var assetsFolder = __dirname + '/../src/assets/';
var userData = fs.readFileSync(assetsFolder + 'users.json', 'utf-8');
var users = JSON.parse(userData).results;

var existingHandles = [];

function tryHandle(user, attempt) {
    var theHandle;
    switch (attempt) {
        case 1:
            theHandle = user.name.first.charAt(0).toLowerCase() + user.name.last.toLowerCase();
            break;
            
        case 2:
            theHandle = user.name.first.toLowerCase() + user.name.last.toLowerCase();
            break;
            
        case 3:
            theHandle = user.email.split('@')[0];
            break;
            
        default:
            throw new Error("Unable to find a unique handle for user", user);
    }
    if (existingHandles.indexOf(theHandle) > -1) {
        return false;
    }
    existingHandles.push(theHandle);
    return theHandle;
}

_.forEach(users, function(user){
    for (var attempt = 1; attempt <= 3; attempt++) {
        var userHandle = tryHandle(user, attempt);
        user.handle = userHandle;
    }
});

fs.writeFileSync(assetsFolder + 'usersWithHandles.json', JSON.stringify(users));