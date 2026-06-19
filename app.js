/* 今朝のAI ─ お気に入り(保存) & 共有(LINE / 共有シート / コピー)
   ・日次ページ: 各.cardに [☆保存][⤴共有][LINE] を自動付与
   ・favorites.html: 保存した一覧を描画
   保存先はブラウザのlocalStorage（同一オリジンで共有・端末ごと） */
(function () {
  var KEY = 'aibrief_favs_v1';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(a) { localStorage.setItem(KEY, JSON.stringify(a)); }
  function dateFromPath() { var m = location.pathname.match(/(\d{4}-\d{2}-\d{2})/); return m ? m[1] : ''; }
  function secClass(el) { var s = el.closest('.sec') || el.closest('.fav-item'); if (!s) return ''; var c = Array.prototype.find.call(s.classList, function (x) { return x.indexOf('s-') === 0; }); return c || ''; }
  function lineURL(title, url) { return 'https://line.me/R/msg/text/?' + encodeURIComponent(title + '\n' + url); }

  function shareItem(title, url, btn) {
    if (navigator.share) {
      navigator.share({ title: title, text: title, url: url }).catch(function () {});
    } else {
      navigator.clipboard && navigator.clipboard.writeText(title + '\n' + url).then(function () {
        if (btn) { var t = btn.textContent; btn.textContent = '✓ コピー済'; setTimeout(function () { btn.textContent = t; }, 1500); }
      }, function () { window.prompt('コピーして共有', title + '\n' + url); });
    }
  }

  function makeActs(title, url, cls, opts) {
    opts = opts || {};
    var bar = document.createElement('div');
    bar.className = 'acts';
    var favs = load();
    var on = favs.some(function (f) { return f.url === url; });

    var fav = document.createElement('button');
    fav.type = 'button'; fav.className = 'act fav' + (on ? ' on' : '');
    fav.textContent = (on ? '★' : '☆') + ' 保存';
    fav.addEventListener('click', function () {
      var a = load();
      if (a.some(function (f) { return f.url === url; })) {
        a = a.filter(function (f) { return f.url !== url; });
        fav.classList.remove('on'); fav.textContent = '☆ 保存';
        if (opts.onRemove) opts.onRemove();
      } else {
        a.unshift({ title: title, url: url, cls: cls, date: dateFromPath() });
        fav.classList.add('on'); fav.textContent = '★ 保存';
      }
      save(a);
    });

    var sh = document.createElement('button');
    sh.type = 'button'; sh.className = 'act'; sh.textContent = '⤴ 共有';
    sh.addEventListener('click', function () { shareItem(title, url, sh); });

    var line = document.createElement('a');
    line.className = 'act line'; line.href = lineURL(title, url);
    line.target = '_blank'; line.rel = 'noopener'; line.textContent = 'LINE';

    bar.appendChild(fav); bar.appendChild(sh); bar.appendChild(line);
    if (opts.extra) bar.appendChild(opts.extra);
    return bar;
  }

  /* 日次ページ: カードに保存/共有を付与 */
  function augmentCards() {
    document.querySelectorAll('.card').forEach(function (card) {
      var h = card.querySelector('.h'); if (!h) return;
      var link = card.querySelector('a.go');
      var url = link ? link.href : location.href;
      var title = h.textContent.trim();
      card.appendChild(makeActs(title, url, secClass(card)));
    });
  }

  /* favorites.html: 一覧描画 */
  function renderFavorites() {
    var box = document.getElementById('favlist'); if (!box) return;
    function draw() {
      var favs = load();
      box.innerHTML = '';
      if (!favs.length) {
        box.innerHTML = '<p class="empty">まだ保存したニュースがないよ。<br>各ニュースの「☆ 保存」を押すとここに溜まる。<br>（保存はこの端末のブラウザ内だけ）</p>';
        return;
      }
      favs.forEach(function (f) {
        var it = document.createElement('article');
        it.className = 'fav-item ' + (f.cls || '');
        var h = document.createElement('div'); h.className = 'h'; h.textContent = f.title;
        var meta = document.createElement('div'); meta.className = 'fav-meta';
        if (f.date) { var d = document.createElement('span'); d.className = 'src'; d.textContent = f.date; meta.appendChild(d); }
        var go = document.createElement('a'); go.className = 'go'; go.href = f.url; go.target = '_blank'; go.rel = 'noopener'; go.textContent = '元記事 →';
        meta.appendChild(go);
        it.appendChild(h);
        var del = document.createElement('button'); del.type = 'button'; del.className = 'act'; del.textContent = '削除';
        var acts = makeActs(f.title, f.url, f.cls, { extra: del, onRemove: draw });
        // 保存済みなので☆ボタンは「削除」と役割が重複→保存ボタンを外し、削除を主に
        acts.removeChild(acts.firstChild);
        del.addEventListener('click', function () { save(load().filter(function (x) { return x.url !== f.url; })); draw(); });
        it.appendChild(meta); it.appendChild(acts);
        box.appendChild(it);
      });
    }
    draw();
    var copyAll = document.getElementById('copyall');
    if (copyAll) copyAll.addEventListener('click', function () {
      var txt = load().map(function (f) { return f.title + '\n' + f.url; }).join('\n\n');
      navigator.clipboard ? navigator.clipboard.writeText(txt).then(function () { copyAll.textContent = '✓ 全部コピーした'; setTimeout(function () { copyAll.textContent = '全部コピー'; }, 1600); }) : window.prompt('コピー', txt);
    });
  }

  function init() { augmentCards(); renderFavorites(); }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
