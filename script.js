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
  var links = ['introduction', 'contact', 'help', 'about', 'Applications', 'Termes_Affixes', 'Autres_Resources']
  var ratios = [];
  for (var link in links) {
    var ratio = similarity(value, links[link]);
    ratios.push(ratio);
  }

  var results = [];
  for (var i=0; i<10; i++) {
    if (ratios[0] == undefined) break;
    var max = Math.max.apply(Math, ratios);
    var index = ratios.indexOf(max);
    var result = links[index];
    results.push(result);
    ratios.splice(index, 1);
    links.splice(index, 1)
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
    label.style.boxShadow = '0 0 0 2px rgba(135, 135, 135, 1)';
    label.style.paddingLeft = '60px';
    label.style.paddingTop = '5px';
    label.style.paddingBottom = '5px';
    label.innerHTML = "";

    var results = search(value);
    for (var result in results) {
      result = results[result];
      var mainPages = ['introduction', 'contact', 'help', 'about'];
      var mainPagesFr = ['Introduction', 'Contactez-moi', 'Contribuer', 'À propos'];
      for (var page in mainPages){
        if (result == mainPages[page]){
          name = mainPagesFr[page];
          i = '';
          break;
        }
        else{
          name = result.replace('_', ' ');
          i = 'articles/';
        };
      }
      // var anchor_tag = '<a href="file:///home/mohyeddine/Documents/Web/Projects/Medicine/articles/' + result + '.html' + '">' + result + '</a><br>'
      var anchor_tag = '<a style="text-transform: capitalize" href="https://mohyoo.github.io/medecinechlef/' + i + result + '.html' + '">' + name + '</a><br>'
      label.innerHTML += anchor_tag;
    }
  }
}
