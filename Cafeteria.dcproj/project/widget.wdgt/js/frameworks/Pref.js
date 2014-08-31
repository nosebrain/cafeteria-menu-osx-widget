var DICT_PREF_SEP = '|';
var DICT_PREF_KEY_VALUE_SEP = '=';

function Pref() {
}

// TODO: extract this methods

Pref.prototype.saveDicPref = function(key, dic) {
  this.saveDicPref(key, dic, false);
}

Pref.prototype.saveDicPref = function(key, dic, system) {
  var value = '';
  for (var a in dic) {
    value += a;
    value += DICT_PREF_KEY_VALUE_SEP;
    value += dic[a];
    value += DICT_PREF_SEP;
  }
  
  this.savePref(key, value, system);
}

Pref.prototype.getDicPref = function(key) {
  this.getDicPref(key, false);
}

Pref.prototype.getDicPref = function(key, system) {
  var stringValue = this.getPref(key, system);
  
  var value = {};
  
  if (!stringValue) {
    return value;
  }
  
  var keyValues = stringValue.split(DICT_PREF_SEP);
  
  for (var i = 0; i < (keyValues.length - 1); i++) { // -1 cause last value is an empty string
    var keyValue = keyValues[i].split(DICT_PREF_KEY_VALUE_SEP);
    if (keyValue.length == 2) {
      value[keyValue[0]] = keyValue[1];
    }
  }
  
  return value;
}

Pref.prototype.savePref = function(key, value) {
  this.savePref(key, value, false);
}

Pref.prototype.savePref = function(key, value, system) {
  if (!system) {
    key = createInstancePreferenceKey(key);
  }
  
  widget.setPreferenceForKey(value, key);
}

Pref.prototype.getPref = function(key) {
  return this.getPref(key, false);
}

Pref.prototype.getPref = function(key, system) {
  if (!system) {
    key = createInstancePreferenceKey(key);
  }
  
  return widget.preferenceForKey(key);
}