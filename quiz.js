let fernet = require('fernet');

// console.log(String.fromCharCode( 104, 116, 116, 112, 115, 58, 47, 47, 101, 110, 103, 105, 110, 101, 101, 114, 105, 110, 103, 45, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 46, 98, 114, 105, 116, 101, 99, 111, 114, 101, 46, 99, 111, 109, 47, 113, 117, 105, 122, 47, 115, 97, 97, 115, 100, 97, 115, 100, 108, 102, 108, 102, 108, 115));

let secret = new fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=');

// Oh no! The code is going over the edge! What are you going to do?
let massage = 'gAAAAABcPqkHmzM2W6IgZyBQBuQRX7Hrz2YnAP4rhhW7RJBHQKxL5PFnI18AxV0Uh5C-bJcu3ANIc0olovhDk1WAZKM2jpEvaTLl49J3gxxMc5knkMYvSV00skl97iVUjhbX13Wg4SuyEkNWyPFLYwrqK2wW37-bfN6RPeh2M0ihiTl8G-npF3a0_FPXpUWbj7kJV28SV2hz';

let token = new fernet.Token({secret: secret, token: massage, ttl:0});
console.log('decoded:', token.decode());