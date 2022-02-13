// Example POST method implementation:
import fetch from 'node-fetch';
import { parse } from 'node-html-parser'

//replace these with your username and password

const username = 'username'
const password = 'password'



var sid = await fetch('https://websinu.utcluj.ro/note/default.asp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=' + username + '&password=' + password,
})
  .then(function (response) {
    return response.text()
  })
  .then(function (html) {
    const root = parse(html);
    return root.querySelector('input').rawAttributes.value
  })

console.log(sid)

var fac = await fetch('https://websinu.utcluj.ro/note/roluri.asp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'sid=' + sid
})
  .then(function (response) {
    return response.text()
  })
  .then(function (html) {
    const root = parse(html)
    var facultate = ''
    var specializare = ''
    root.getElementsByTagName("td").forEach((element, index) => {
      var pos = element.text.search('Facultatea')
      var pos1 = 0
      var spec = 0
      var spec1 = 0
      if (pos != -1) {
        pos1 = element.text.search(',')
        facultate = element.text.substring(pos, pos1).replace(/ /g, '+')
        spec = element.text.search(':')
        spec += 2
        spec1 = element.text.search(' - Vizualizare')
        specializare = element.text.substring(spec, spec1).replace(/ /g, '+')
        specializare = specializare.replace('(', '%28')
        specializare = specializare.replace(')', '%29')
      }
    })
    return {
      'facultate': facultate,
      'specializare': specializare
    }
  })

console.log(fac)
console.log('\n\n\n')

let materii = await fetch('https://websinu.utcluj.ro/note/roluri.asp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'hidSelfSubmit=roluri.asp&sid=' + sid + '&hidOperation=N&hidNume_Facultate=' + fac.facultate + '&hidNume_Specializare=' + fac.specializare
})
  .then(function (response) {
    return response.text()
  })
  .then(function (html) {
    const root = parse(html)
    //console.log(html)
    const tab = root.getElementsByTagName("td")
    tab.pop()
    tab.pop()

    let index = 0;
    for (let i = 0; i < tab.length; i++) {
      if (tab[i].text == 'An') {
        i += 6
        index = i;
        break;
      }
    }

    let arr = []
    let materie = {
      an: '',
      semestru: '',
      nume: '',
      notare: '',
      data: '',
      nota: '', 
    }

    for (let i = index; i < tab.length; i ++) {
      if (((i - index) % 6) == 0)
        materie.an = tab[i].text
      if (((i - index) % 6) == 1)
        materie.semestru = tab[i].text
      if (((i - index) % 6) == 2) {
        materie.nume = tab[i].text
        console.log(tab[i].text)
      }
      if (((i - index) % 6) == 3)
        materie.notare = tab[i].text
      if (((i - index) % 6) == 4)
        materie.data = tab[i].text
      if (((i - index) % 6) == 5) {
        materie.nota = tab[i].text
        arr.push(materie)
        materie = {
          an: '',
          semestru: '',
          nume: '',
          notare: '',
          data: '',
          nota: '', 
        }
      }

    }
    
    return arr
  })

console.log(materii)