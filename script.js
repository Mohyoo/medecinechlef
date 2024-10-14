function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function search(value) {
  var links = ['Introduction.html', 'Cœur.html']
  var names = ['Introduction', 'Cœur']
  var ratios = []
  for (var name in names) {
    var ratio = similarity(value, names[name]);
    ratios.push(ratio);
  }

  var results = [];
  for (var i=0; i<10; i++) {
    if (ratios[0] == undefined) break;
    var max = Math.max.apply(Math, ratios);
    var index = ratios.indexOf(max);
    var result = names[index];
    results.push(result);
    ratios.splice(index, 1);
    names.splice(index, 1)
  }

  return results;
}

function catchSearchValue() {
  var value = document.getElementById('search_input_id').value;
  var label = document.getElementById('search_labels_id');

  if (!value.trim()) {
    label.innerHTML = "";
    label.style.boxShadow = 'none';
    label.style.padding = '0';
  }
  else {
    label.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.4)';
    label.style.paddingLeft = '60px';
    label.style.paddingTop = '5px';
    label.style.paddingBottom = '5px';
    label.innerHTML = "";

    var results = search(value);
    for (var result in results) {
      result = results[result];
      var anchor_tag = '<a href="https://mohyoo.github.io/medecinechlef/articles/' + result + '.html' + '">' + result + '</a><br>'
      label.innerHTML += anchor_tag;
    }
  }
}
