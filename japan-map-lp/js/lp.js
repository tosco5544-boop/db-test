/* LP：data/checked.js の内容を地図と一覧に反映します。 */
(function () {
  var data = window.PREF_DATA || { checked: [] };
  var checked = (data.checked || []).filter(function (c) { return c >= 1 && c <= 47; });
  var set = new Set(checked);
  var next = (data.next || []).filter(function (c) { return c >= 1 && c <= 47 && !set.has(c); });
  var nextSet = new Set(next);
  if (next.length) {
    var nl = document.getElementById("nextLine");
    nl.textContent = "次の目的地：" + next.map(function (c) { return window.JapanMap.NAMES[c - 1]; }).join("・");
    nl.hidden = false;
  }

  // 達成数
  document.getElementById("count").textContent = set.size;
  var rate = Math.round(set.size / 47 * 100);
  document.getElementById("rate").textContent = "達成率 " + rate + "%";
  requestAnimationFrame(function () { document.getElementById("bar").style.width = rate + "%"; });
  if (data.updated) document.getElementById("updated").textContent = "最終更新：" + data.updated.replace(/-/g, ".");

  // 地方別一覧
  var wrap = document.getElementById("regions");
  window.JapanMap.REGIONS.forEach(function (r) {
    var n = 0, lis = "";
    for (var c = r[1]; c <= r[2]; c++) {
      var on = set.has(c); if (on) n++;
      lis += '<li><span class="pill' + (on ? " is-on" : nextSet.has(c) ? " is-next" : "") + '">' + window.JapanMap.NAMES[c - 1] + "</span></li>";
    }
    var div = document.createElement("div");
    div.className = "region";
    div.innerHTML = "<h3>" + r[0] + "<span>" + n + " / " + (r[2] - r[1] + 1) + "</span></h3><ul>" + lis + "</ul>";
    wrap.appendChild(div);
  });

  // 地図（閲覧のみ）
  var box = document.getElementById("mapBox");
  window.JapanMap.create(box, { editable: false, checked: checked, next: next }).catch(function () {
    box.innerHTML = '<div class="map-status">地図を読み込めませんでした。インターネット接続を確認して再読み込みしてください。</div>';
  });

  // 拡大（スマホで県名を読みやすく）
  var scroll = document.getElementById("mapScroll"), zb = document.getElementById("zoom");
  zb.addEventListener("click", function () {
    var z = scroll.classList.toggle("is-zoom");
    zb.textContent = z ? "全体を表示" : "地図を拡大";
    if (z) { scroll.scrollLeft = scroll.scrollWidth * 0.35; scroll.scrollTop = scroll.scrollHeight * 0.3; }
  });
})();
