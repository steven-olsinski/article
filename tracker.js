function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function init()
{
    var pixel = getUrlParameter('p');
    if (pixel) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', pixel);
        fbq('track', 'PageView');
    }

}

function initEvents()
{
    var pixel = getUrlParameter('p');
    if (pixel) {
        document.addEventListener('click', function (ev) {
            var isLink = false;
            for(var i = 0; i < ev.path.length; i++) {
                if (ev.path[i].tagName && ev.path[i].tagName.toUpperCase() === 'A') {
                    isLink = true;
                }
            }

            console.log(isLink);
            if (isLink) {
                fbq('track', 'Lead');
            }
        });
    }
}

(function () {
    init();
    initEvents();
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open("GET", trackerHost + "/track/" + campaignId + "?referrer=" + escape(document.referrer) + "&uri=" + escape(window.location.href), true);
    xhr.onload = function() {
        if (xhr.status !== 200)
            return;

        if (xhr.getResponseHeader("Struct-Response") !== "true") {
            var resp = JSON.parse(xhr.responseText);

            var xhr2 = new XMLHttpRequest();
            xhr2.withCredentials = true;
            xhr2.open("GET", resp.url, true);
            xhr2.onload = function() {
                if (xhr.status !== 200)
                    return;

                document.open();
                document.write(xhr2.responseText);
                document.close();
                initEvents();

            };
            xhr2.send();
        }
    };
    xhr.send();
})();