let button = document.getElementById('connect');
button.addEventListener('click', function() {
    let username = document.getElementById('username').value;
    let radios = document.getElementsByName('item');
    let group = '';
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            group = radios[i].title;
        }
    }
    if (username == '') {
        alert('Digite o nome de usuário!');
    } else if (group == 'Selecione o grupo...') {
        alert('Selecione o grupo!');
    } else {
        window.location.href = 'http://localhost:8080/chat?username=' + username + '&group=' + group;
    }
});