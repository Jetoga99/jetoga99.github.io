

(function() {
    "use strict";
    const select = (el, all = false) => {
    el = el.trim()
    if (all) {
        return [...document.querySelectorAll(el)]
    } else {
        return document.querySelector(el)
    }
  }

    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)

        if (selectEl) {
        if (all) {
            selectEl.forEach(e => e.addEventListener(type, listener))
        } else {
            selectEl.addEventListener(type, listener)
        }
        }
    }

    const scrollto = (el) => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }

    on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })
    on('click', '#navbar .nav-link', function(e) {
        let section = select(this.hash)
        if (section) {
          e.preventDefault()
    
          let navbar = select('#navbar')
          let header = select('#header')
          let sections = select('section', true)
          let navlinks = select('#navbar .nav-link', true)
    
          navlinks.forEach((item) => {
            item.classList.remove('active')
          })
    
          this.classList.add('active')
    
          if (navbar.classList.contains('navbar-mobile')) {
            navbar.classList.remove('navbar-mobile')
            let navbarToggle = select('.mobile-nav-toggle')
            navbarToggle.classList.toggle('bi-list')
            navbarToggle.classList.toggle('bi-x')
          }
    
          if (this.hash == '#header') {
            header.classList.remove('header-top')
            sections.forEach((item) => {
              item.classList.remove('section-show')
            })
            return;
          }
    
          if (!header.classList.contains('header-top')) {
            header.classList.add('header-top')
            setTimeout(function() {
              sections.forEach((item) => {
                item.classList.remove('section-show')
              })
              section.classList.add('section-show')
    
            }, 350);
          } else {
            sections.forEach((item) => {
              item.classList.remove('section-show')
            })
            section.classList.add('section-show')
          }
    
          scrollto(this.hash)
        }
      }, true)
    
      window.addEventListener('load', () => {
        if (window.location.hash) {
          let initial_nav = select(window.location.hash)
    
          if (initial_nav) {
            let header = select('#header')
            let navlinks = select('#navbar .nav-link', true)
    
            header.classList.add('header-top')
    
            navlinks.forEach((item) => {
              if (item.getAttribute('href') == window.location.hash) {
                item.classList.add('active')
              } else {
                item.classList.remove('active')
              }
            })
    
            setTimeout(function() {
              initial_nav.classList.add('section-show')
            }, 350);
    
            scrollto(window.location.hash)
          }
        }
});






})()

let btnQuote=document.getElementById("btnQuote");
let btnPrint=document.getElementById("btnPrint")
btnQuote.addEventListener("click",function(e){
    e.preventDefault();
    let iva=document.getElementById("checkIVA").checked;
    let extras=document.getElementById("inputExtras");
    let email= document.getElementById("inputEmail");
    let name= document.getElementById("inputName");
    let servicio=document.getElementById("servicio").value;
    let cardText=document.getElementById("cardText");
    let cardCost=document.getElementById("cardCost");
    let flag=true;
    console.log(email)
    if (flag){
        cardText.innerHTML= `Email: ${email},<br/> Name:${name}, <br/>
        We can quoute a price of requierements:<br/> ${getRequirements(extras)}
        `;
        cardCost.innerHTML="<strong>$ " + quote(servicio,iva,extras).toFixed(2);
    }
    
});

btnPrint.addEventListener("click",function(e){
    e.preventDefault();
    window.print();
})
const getRequirements=(ex)=>{
    let str=`<br/><ul class="listgroup col-4">`;
    for(let i=0; i<ex.options.length;i++){
        console.log(ex.options[i].selected);
        if(ex.options[i].selected){
            str+=`<li class="list-group-item list-group-item-action"> ${ex.options[i].text} </li>`;
        }
    }
    str+=`</ul>`
    return str;
};

function quote(s,vat,ex){

    let result=parseInt(s);
    let i=0;
    do {
        if(ex.options[i].selected){
            result+=parseFloat(ex.options[i].value);
        }
        i++;
    }while(i<ex.options.length)
    ;
    if (vat){
        result *=1.16;
    }
    console.log(result)
    return result;
}