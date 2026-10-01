/* ==========================================================================
   Tapajós Alimentos / AvisPará — comportamentos do site
   Sem dependências externas.
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     CONFIGURAÇÃO PENDENTE
     Para o formulário de orçamento passar a enviar de verdade, coloque aqui
     o endereço do serviço que vai receber os dados (ex.: Formspree, Basin,
     Web3Forms ou um script no seu próprio servidor).
     Enquanto estiver vazio, o formulário valida os campos e mostra um aviso
     honesto de que o envio ainda não está configurado — ele nunca finge que
     a mensagem foi enviada.
     ---------------------------------------------------------------------- */
  var ENDPOINT_ORCAMENTO = '';

  var root = document.documentElement;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Abertura da home ---------------------------------------- */
  var intro = document.querySelector('.intro');
  if (intro) {
    var revelar = function () {
      if (root.classList.contains('revealed')) return;
      root.classList.add('revealed');
      // tira a cortina do caminho quando a animação termina
      setTimeout(function () { intro.style.display = 'none'; }, 1400);
    };
    if (reduz) {
      revelar();
    } else {
      window.addEventListener('load', function () { setTimeout(revelar, 850); });
      setTimeout(revelar, 2400); // garante a revelação mesmo se uma imagem demorar
    }
  } else {
    root.classList.add('revealed');
  }

  /* ---------- Cabeçalho ------------------------------------------------ */
  var header = document.querySelector('.header');
  if (header) {
    var aoRolar = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
  }

  var btnMenu = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (btnMenu && nav) {
    var fechar = function () {
      nav.classList.remove('open');
      btnMenu.setAttribute('aria-expanded', 'false');
      btnMenu.setAttribute('aria-label', 'Abrir menu');
    };
    btnMenu.addEventListener('click', function () {
      var aberto = nav.classList.toggle('open');
      btnMenu.setAttribute('aria-expanded', String(aberto));
      btnMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) fechar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  }

  /* ---------- Entradas suaves ao rolar --------------------------------- */
  var alvos = document.querySelectorAll('.fade');
  if (alvos.length && !reduz && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    alvos.forEach(function (el) { obs.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('in'); });
  }
  // Rede de segurança: nada pode ficar invisível para sempre se algo falhar.
  setTimeout(function () {
    document.querySelectorAll('.fade:not(.in)').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
  }, 4000);

  /* ---------- Calibre: peso médio por ave ------------------------------ */
  document.querySelectorAll('[data-calibre]').forEach(function (grupo) {
    var saida = document.getElementById(grupo.getAttribute('data-calibre'));
    if (!saida) return;
    grupo.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        grupo.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        saida.textContent = (20 / Number(b.dataset.n)).toFixed(2).replace('.', ',') + ' kg';
      });
    });
  });

  /* ---------- Catálogo: busca e filtro --------------------------------- */
  var catalogo = document.getElementById('catalogo');
  if (catalogo) {
    var itens = Array.prototype.slice.call(catalogo.querySelectorAll('[data-cat]'));
    var vazio = document.getElementById('sem-resultado');
    var busca = document.getElementById('busca');
    var filtro = 'todos';

    var aplicar = function () {
      var termo = (busca && busca.value || '').trim().toLowerCase();
      var visiveis = 0;
      itens.forEach(function (el) {
        var okCat = filtro === 'todos' || el.dataset.cat === filtro;
        var okTexto = !termo || el.textContent.toLowerCase().indexOf(termo) !== -1;
        var mostrar = okCat && okTexto;
        el.hidden = !mostrar;
        if (mostrar) visiveis++;
      });
      if (vazio) vazio.hidden = visiveis > 0;
    };

    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        filtro = chip.dataset.filtro;
        aplicar();
      });
    });
    if (busca) busca.addEventListener('input', aplicar);
  }

  /* ---------- Produto pré-selecionado no formulário -------------------- */
  var selProduto = document.getElementById('produto');
  if (selProduto) {
    var alvo = new URLSearchParams(location.search).get('produto');
    if (alvo) {
      var achou = Array.prototype.some.call(selProduto.options, function (o) {
        if (o.value === alvo) { selProduto.value = alvo; return true; }
        return false;
      });
      if (achou) {
        var msg = document.getElementById('mensagem');
        if (msg && !msg.value) {
          msg.value = 'Gostaria de receber um orçamento de ' +
            selProduto.options[selProduto.selectedIndex].text + '. Segue o contato para retorno.';
        }
      }
    }
  }

  /* ---------- Formulário de orçamento ---------------------------------- */
  var form = document.getElementById('form-orcamento');
  if (form) {
    var status = document.getElementById('status-envio');
    var enviar = form.querySelector('[type="submit"]');

    var mostrar = function (estado, html) {
      status.setAttribute('data-state', estado);
      status.innerHTML = html;
    };

    var erroDe = function (campo) {
      if (campo.validity.valueMissing) return 'Preencha este campo.';
      if (campo.validity.typeMismatch && campo.type === 'email') return 'Digite um e-mail válido.';
      if (campo.validity.tooShort) return 'Escreva um pouco mais.';
      return 'Confira este campo.';
    };

    var validarCampo = function (campo) {
      var wrap = campo.closest('.field');
      var saida = wrap && wrap.querySelector('.err');
      var ok = campo.checkValidity();
      if (wrap) wrap.classList.toggle('invalid', !ok);
      if (saida) saida.textContent = ok ? '' : erroDe(campo);
      campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    };

    form.querySelectorAll('input,select,textarea').forEach(function (campo) {
      campo.addEventListener('blur', function () { validarCampo(campo); });
      campo.addEventListener('input', function () {
        if (campo.closest('.field').classList.contains('invalid')) validarCampo(campo);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var campos = Array.prototype.slice.call(form.querySelectorAll('input,select,textarea'));
      var invalidos = campos.filter(function (c) { return !validarCampo(c); });

      // Telefone OU e-mail: pelo menos um dos dois
      var tel = form.querySelector('#telefone');
      var mail = form.querySelector('#email');
      var contatoOk = (tel.value.trim() || mail.value.trim());
      if (!contatoOk) {
        [tel, mail].forEach(function (c) {
          c.closest('.field').classList.add('invalid');
          c.closest('.field').querySelector('.err').textContent = 'Informe pelo menos um telefone ou e-mail.';
        });
        invalidos.push(tel);
      }

      if (invalidos.length) {
        mostrar('err', 'Faltam informações para enviar. Confira os campos destacados.');
        invalidos[0].focus();
        return;
      }

      if (!ENDPOINT_ORCAMENTO) {
        // Nada é enviado, então nada é anunciado como enviado.
        mostrar('todo',
          '<strong>O envio automático ainda não está configurado.</strong><br>' +
          'Seu texto continua preenchido aqui. Para falar agora com o comercial, ligue para ' +
          '<a href="tel:+5593991637443">(93) 99163-7443</a> ou ' +
          '<button type="button" class="btn btn-sm btn-dark" id="copiar" style="margin-top:12px">Copiar minha mensagem</button>');

        var btnCopiar = document.getElementById('copiar');
        if (btnCopiar) {
          btnCopiar.addEventListener('click', function () {
            var dados = new FormData(form);
            var linhas = [];
            dados.forEach(function (v, k) { if (String(v).trim()) linhas.push(k + ': ' + v); });
            var texto = linhas.join('\n');
            var feito = function () { btnCopiar.textContent = 'Copiado'; };
            if (navigator.clipboard) {
              navigator.clipboard.writeText(texto).then(feito, feito);
            } else {
              var ta = document.createElement('textarea');
              ta.value = texto; document.body.appendChild(ta); ta.select();
              try { document.execCommand('copy'); } catch (err) {}
              document.body.removeChild(ta); feito();
            }
          });
        }
        return;
      }

      mostrar('sending', 'Enviando sua solicitação…');
      enviar.disabled = true;

      fetch(ENDPOINT_ORCAMENTO, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        mostrar('ok', '<strong>Solicitação enviada.</strong> O comercial vai responder pelo contato informado.');
        form.reset();
      }).catch(function () {
        // O texto do usuário é preservado: o formulário não é limpo em caso de falha.
        mostrar('err',
          '<strong>Não foi possível enviar agora.</strong> Seu texto continua preenchido. ' +
          'Tente de novo em instantes ou ligue para <a href="tel:+5593991637443">(93) 99163-7443</a>.');
      }).then(function () {
        enviar.disabled = false;
      });
    });
  }
})();
