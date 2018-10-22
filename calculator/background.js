const MAX_CURRENCIES = 15;
const MIN_CURRENCIES = 2;
var cache = { 'USD' : '1', 'KYD' : '0.82000' };
var gloabal_timer = null;
var timeout = false;

refreshRate();
setInterval(refreshRate, 15 * 60 * 1000);

function round(value, decimal)
{
    var rounded = value * Math.pow(10, decimal);
    rounded = Math.round(rounded);
    return rounded / Math.pow(10, decimal);
}

function refreshRate()
{
	var timer = null;
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', 'https://api.openrates.io/latest?base=USD', true);
	xmlhttp.onload = 
	function()
	{
		timeout = false;
		clearTimeout(timer);
		var t = JSON.parse(xmlhttp.responseText);
		var rates = t.rates;
		for(var key in rates) {
			try
			{
				cache[key] = rates[key]
			}
			catch(err){ continue; }
		}
	}

	xmlhttp.send(null);

	timer = setTimeout(function(){ xmlhttp.abort(); timeout = true; }, 10000);
}

function convertValue(value, from, to, callback)
{	
	if(timeout)
		refreshRate();

	gloabal_timer = setTimeout(function(){ callback({status: 'error'}); }, 10000);	
	convertValueRecursive(value, from, to, callback);
}

function convertValueRecursive(value, from, to, callback)
{
	var fromRate = cache[from];
	var toRate = cache[to];
	
	if(fromRate == undefined || toRate == undefined)
	{
		setTimeout(function(){ convertValueRecursive(value, from, to, callback); }, 500);
		return;
	}
	
	clearTimeout(gloabal_timer);
	var converted = round((value / fromRate) * toRate, 4);
	callback({status: 'success', value: converted});
}

/*
function getVersion() 
{
	var details = chrome.app.getDetails();
	return details.version;
}
*/

/*var currVersion = getVersion();
var prevVersion = localStorage.getItem('version');
if (currVersion != prevVersion) 
{
	if (prevVersion != null) 
	{*/
		var currencies = [];
	
		for (var i = 0; i < MAX_CURRENCIES; i++)
		{
			var currency = localStorage.getItem('currency' + i);
			
			if(currency == undefined) 
			{
				if(i == 0)
					currency = 'EUR';
				else if(i == 1)
					currency = 'USD';
				else
					break;
			}

			currencies[i] = currency;
		}
		
		localStorage.setItem('currencies', JSON.stringify(currencies));
	/*
    }
    
	localStorage.setItem('version', currVersion);
}
*/