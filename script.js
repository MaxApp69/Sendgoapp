
// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD8Rmym4TQJtG4i_eY9MDyrCVqi4zZdA6w",
    authDomain: "continue-56506.firebaseapp.com",
    databaseURL: "https://continue-56506-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "continue-56506",
    storageBucket: "continue-56506.firebasestorage.app",
    messagingSenderId: "182199976967",
    appId: "1:182199976967:web:9389057bcaa05d605556a2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function login() {
    let id = document.getElementById('login-id').value + 'send.go';
    let pin = document.getElementById('login-pin').value;
    db.ref('users/' + id).once('value', (snapshot) => {
        if(snapshot.exists() && snapshot.val().pin === pin) {
            document.getElementById('username').innerText = snapshot.val().name;
            document.getElementById('user-id').innerText = id;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('home-section').style.display = 'block';
        } else {
            alert('Invalid ID or PIN');
        }
    });
}

function register() {
    let name = document.getElementById('reg-name').value;
    let id = document.getElementById('reg-id').value + 'send.go';
    let pin = document.getElementById('reg-pin').value;
    db.ref('users/' + id).once('value', (snapshot) => {
        if(snapshot.exists()) {
            alert('ID already exists');
        } else {
            db.ref('users/' + id).set({ name: name, pin: pin });
            alert('Registered successfully! Please login now.');
        }
    });
}

function addFriend() {
    let friendName = document.getElementById('add-friend-name').value;
    let friendId = document.getElementById('add-friend-id').value + 'send.go';
    let friendsList = document.getElementById('friends-list');
    let div = document.createElement('div');
    div.innerHTML = friendName + ' (' + friendId + ') <button onclick="chooseFriend('' + friendId + '')">∆</button>';
    friendsList.appendChild(div);
}

let currentFriendId = '';
function chooseFriend(id) {
    currentFriendId = id;
    alert('Selected: ' + id);
}

function sendMessage() {
    if(currentFriendId === '') {
        alert('Choose a friend to send message');
        return;
    }
    let message = document.getElementById('message-box').value;
    let file = document.getElementById('file-upload').files[0];

    if(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        axios.post('https://api.cloudinary.com/v1_1/dr93s1jal/upload', formData)
        .then(response => {
            let fileUrl = response.data.secure_url;
            db.ref('messages/' + currentFriendId).push({ text: message, file: fileUrl });
            alert('Message sent with file');
        });
    } else {
        db.ref('messages/' + currentFriendId).push({ text: message });
        alert('Message sent');
    }
}
