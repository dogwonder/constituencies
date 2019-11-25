(function () {

    //remove no-js class
    document.documentElement.className = document.documentElement.className.replace("no-js","js");


    //Generic function for getting element siblings
    var getSiblings = function (elem) {

        // Setup siblings array and get the first sibling
        var siblings = [];
        var sibling = elem.parentNode.firstChild;
    
        // Loop through each sibling and push to the array
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== elem) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling
        }
    
        return siblings;
    
    };

    //🍪 notice
    function cookieNoticeSeen() {

        var getCookie = function (name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        };

        // Cookie vars
        var cookieNotice = document.getElementById('cookieNotice');
        var cookieButton = document.getElementById('cookieButton');

        // Set a cookie
        cookieButton.addEventListener('click', function (event) {
            Cookies.set('jw_cookie_notice', 'closed', { expires: 365, path: '' });
            cookieNotice.classList.remove('open');
            document.body.classList.remove('has-cookie');
        }, false);

        //Remove notice if cookie already set
        if (Cookies.get('jw_cookie_notice') == 'closed') {
            cookieNotice.classList.remove('open');
            document.body.classList.remove('has-cookie');
        }

    };

    //Equalize image heights inline with text blocks
    function equalizer(elem) {

        var blocks = document.querySelectorAll(elem);
        
        if(!blocks) return;

        blocks.forEach(function (item) {

            var textHeight = item.offsetHeight;
            var siblings = getSiblings(item);

            // console.log(textHeight);
            // console.log(siblings);
            
            //Get the siblings
            siblings.forEach(function (sibling) {
                //If not data equal
                if (!sibling.matches('[data-equal]')) return;
                // var siblingType = sibling.getAttribute('data-equal');
                sibling.style.height = textHeight + "px";
            });


        });

        
    };

    //Vanilla nav toggle button
    function toggleNav(button, elem) {

        // HTML
        // <nav class="navigation">
        // <button aria-expanded="false" aria-controls="menu">Menu</button>
        // <ul id="menu" hidden>
        //     <li><a href="/">Home</a></li>
        //     <li><a href="/benefits">Benefits</a></li>
        //     <li><a href="/pricing">Pricing</a></li>
        //     <li><a href="/blog">Blog</a></li>
        // </ul>
        // </nav>    

        // CSS
        // [hidden] { display: none; }
        // [aria\-expanded=true] {}    
        // #menu:not([hidden]) {pointer-events: all;}

        // Init 
        // toggleNav('.navigation button', '.navigation ul');

        const toggleMenu = document.querySelector(button);
        const menu = document.querySelector(elem);

        toggleMenu.addEventListener('click', function() {

            // The JSON.parse function helps us convert the attribute from a string to a real boolean.
            const open = JSON.parse(toggleMenu.getAttribute('aria-expanded'));

            toggleMenu.setAttribute('aria-expanded', !open);
            menu.hidden = !menu.hidden;

        });


    };

    // Handler when the DOM is fully loaded and after webfont's etc
    window.addEventListener("load", function(){

        //Cookie notice
        cookieNoticeSeen();

        //Toggle nav
        toggleNav('#nav-toggle', '#nav-menu');

        //Equal height columns
        equalizer('[data-col]');

        //Load the cookie policy functionality
        var cookie = new JWCookies();
        cookie.init({
            onClick: true,
            onSubmit: false
        });
        
    });


})();

