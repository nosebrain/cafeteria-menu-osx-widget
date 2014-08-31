var PREF_INFO_KEY = "uniInfos";
var PREF_UNI_KEY = "uni";
var PREF_CAFETERIA_KEY = "cafeteria";
var PREF_PRICE = "price";

var SERVICE_URL =  "http://localhost:9090/service";

var SELECTOR_UNIVERSITY = "#universityPopup";
var SELECTOR_CAFETERIA = '#cafeteriaPopup';

var NOT_SET = 'not_set';

function CafeteriaWidget() {
    this.prefs = new Pref();
    this.updater = new CafeteriaUpdater(this.prefs);
    var savedInfos = this.prefs.getPref(PREF_INFO_KEY, true);
    var self = this;
    if (savedInfos === undefined) {
        alert("loading informations");
        $.ajax({
            url: SERVICE_URL,
            success: function(data) {
                self.gotInformation(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    } else {
        this.infos = $(savedInfos);
    }
}

CafeteriaWidget.prototype.gotInformation = function(infos) {
    this.prefs.savePref(PREF_INFO_KEY, infos, true);
    this.infos = infos;
    this.loadPrefs();
    this.prepareSettings();
}

CafeteriaWidget.prototype.loadPrefs = function() {
    this.updateView();
    
    var settings = this.prefs.getPref(PREF_PRICE);
    if (settings === undefined) {
        settings = 0;
    }
    
    this.priceSettings = settings;
}

CafeteriaWidget.prototype.savePrefs = function() {
    var uniId = $(SELECTOR_UNIVERSITY + ' option:selected').attr('value');
    if (uniId != NOT_SET) {
        var cafeteriaId = $(SELECTOR_CAFETERIA + ' option:selected').attr('value');
        this.prefs.savePref(PREF_UNI_KEY, uniId);
        this.prefs.savePref(PREF_CAFETERIA_KEY, cafeteriaId);
    }
    
    var newSettingPrice = $('#pricePopup option:selected').attr('value');
    this.prefs.savePref(PREF_PRICE, newSettingPrice);
    this.priceSettings = parseInt(newSettingPrice);
}

CafeteriaWidget.prototype.updateView = function() {
    var prefUni = this.prefs.getPref(PREF_UNI_KEY);
    var prefCaf = this.prefs.getPref(PREF_CAFETERIA_KEY);
    
    if (this.currentUni != prefUni || this.currentCafeteria != prefCaf) {
        alert("changed");
        this.currentUni = prefUni;
        this.currentCafeteria = prefCaf;
        this.cafeteria = this.infos[this.currentUni].cafeterias[this.currentCafeteria];
        var self = this;
        $("#cafeteria").text(this.cafeteria.name).unbind().click(function() {
            widget.openURL(self.cafeteria.url);
        });
        
        this.updater.checkForUpdates(this.currentUni, this.currentCafeteria, this);
    }
}

CafeteriaWidget.prototype.updateMenu = function(menu) {
    var cafeteriaWidget = this;
    $(menu.days).each(function(index, day) {
        var dayUI = $('<div id="day' + (index + 1) + '" class="day"></div>');
        $("#menu").append(dayUI);
        var row;
        $(day.food).each(function(index, food) {
            if (index % 2 == 0) {
                row = $('<div class="row"></div>');
                dayUI.append(row);
            }
            var descriptionUI = $('<div class="cell description"></div>').text(food.description);
            row.append(descriptionUI);
            
            var priceUI = $('<div class="cell price"></div>').text(food.prices[cafeteriaWidget.priceSettings] + '€');
            row.append(priceUI);
        });
        
        if ($(day.food).length % 2 != 0) {
            var descriptionUI = $('<div class="cell description"></div>');
            row.append(descriptionUI);
            
            var priceUI = $('<div class="cell price"></div>');
            row.append(priceUI);
        }
    });
    
    this.showCurrentDay();
}

CafeteriaWidget.prototype.showCurrentDay = function() {
    $('.day').hide();
    $('.day').first().show(); // TODO:
}

CafeteriaWidget.prototype.prepareSettings = function() {
    $("#loadingBack").hide();
    var uniPopup = $(SELECTOR_UNIVERSITY);
    uniPopup.append($('<option></option>').attr('value', NOT_SET).text("Bitte wählen ..."));
    for (unikey in this.infos) {
        var uni = this.infos[unikey];
        var uniOptionUI = $('<option></option>').attr('value', unikey).text(uni.name);
        if (unikey == this.currentUni) {
            uniOptionUI.attr('selected', '');
        }
        uniPopup.append(uniOptionUI);
    }
    var self = this;
    var cafeteriaPopup = $(SELECTOR_CAFETERIA);
    uniPopup.change(function() {
        var selectedValue = $(this).find('option:selected').attr('value');
        if (selectedValue != NOT_SET) {
            cafeteriaPopup.removeAttr('disabled').empty();
            $(self.infos[selectedValue].cafeterias).each(function(index, cafeteria) {
                cafeteriaPopup.append($('<option></option>').attr('value', index).text(cafeteria.name));
            });
        } else {
            cafeteriaPopup.empty().attr('disabled', '');
        }
    });
    
    if (this.currentUni !== undefined) {
        alert('preparing cafeteria select');
        $(this.infos[currentUni].cafeterias).each(function(index, cafeteria) {
            var cafeteriaOptionUI = $('<option></option>').attr('value', index).text(cafeteria.name);
            if (index == this.currentCafeteria) {
                cafeteriaOptionUI.attr('selected', '');
            }
            cafeteriaPopup.append(cafeteriaOptionUI);
        });
    }
}