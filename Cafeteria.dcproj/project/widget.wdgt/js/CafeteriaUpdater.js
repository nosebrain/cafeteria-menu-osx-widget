function CafeteriaUpdater(prefs) {
    this.prefs = prefs;
}


CafeteriaUpdater.prototype.checkForUpdates = function(uniId, cafeteriaId, cafWidget) {
    var cafUrl = SERVICE_URL + "/" + uniId + "/" + cafeteriaId + "/36.json";
    $.ajax({
        url : cafUrl,
        success: function(data) {
            cafWidget.updateMenu(data);
        }
    });
}