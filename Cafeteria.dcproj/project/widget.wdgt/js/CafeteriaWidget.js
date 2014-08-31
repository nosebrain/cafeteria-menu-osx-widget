var PREF_INFO_KEY = "uniInfos";
var PREF_UNI_KEY = "uni";
var PREF_CAFETERIA_KEY = "cafeteria";

var SERVICE_URL =  "http://localhost:9090/service";

var SELECTOR_UNIVERSITY = "#universityPopup";
var SELECTOR_CAFETERIA = '#cafeteriaPopup';

var NOT_SET = 'not_set';

function CafeteriaWidget() {
    this.prefs = new Pref();
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
    this.prepareSettings();
}

CafeteriaWidget.prototype.savePrefs = function() {
    var uniId = $(SELECTOR_UNIVERSITY + ' option:selected').attr('value');
    if (uniId != NOT_SET) {
        var cafeteriaId = $(SELECTOR_CAFETERIA + ' option:selected').attr('value');
        this.prefs.savePref(PREF_UNI_KEY, uniId);
        this.prefs.savePref(PREF_CAFETERIA_KEY, cafeteriaId);
    }
}

CafeteriaWidget.prototype.updateView = function() {
    var prefUni = this.prefs.getPref(PREF_UNI_KEY);
    var prefCaf = this.prefs.getPref(PREF_CAFETERIA_KEY);
    
    if (this.currentUni != prefUni || this.currentCafeteria != prefCaf) {
        this.currentUni = prefUni;
        this.currentCafeteria = prefCaf;
        this.cafeteria = this.infos[this.currentUni].cafeterias[this.currentCafeteria];
        var self = this;
        $("#cafeteria").text(this.cafeteria.name).unbind().click(function() {
            widget.openURL(self.cafeteria.url);
        });
    }
}

CafeteriaWidget.prototype.updateMenu = function(menu) {

}

CafeteriaWidget.prototype.prepareSettings = function() {
    $("#loadingBack").hide();
    var uniPopup = $(SELECTOR_UNIVERSITY);
    uniPopup.append($('<option></option>').attr('value', NOT_SET).text("Bitte wählen ..."));
    for (unikey in this.infos) {
        var uni = this.infos[unikey];
        uniPopup.append($('<option></option>').attr('value', unikey).text(uni.name));
    }
    var self = this;
    uniPopup.change(function() {
        var selectedValue = $(this).find('option:selected').attr('value');
        var cafeteriaPopup = $(SELECTOR_CAFETERIA);
        if (selectedValue != NOT_SET) {
            cafeteriaPopup.removeAttr('disabled').empty();
            $(self.infos[selectedValue].cafeterias).each(function(index, cafeteria) {
                cafeteriaPopup.append($('<option></option>').attr('value', index).text(cafeteria.name));
            });
        } else {
            cafeteriaPopup.empty().attr('disabled', '');
        }
    });
}