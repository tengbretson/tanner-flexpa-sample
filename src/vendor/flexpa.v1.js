// vendored from https://js.flexpa.com/v1/
var _FlexpaLink = (function () {
  'use strict';
  var o = Object.defineProperty;
  var h = (a, s, r) =>
    s in a
      ? o(a, s, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (a[s] = r);
  var t = (a, s, r) => (h(a, typeof s != 'symbol' ? s + '' : s, r), r);
  class a {
    constructor() {
      t(this, 'iframe');
      t(this, 'publishableKey');
      t(this, 'user');
      t(this, 'endpoint');
      t(this, 'targetUrl');
      t(this, 'strict', !0);
      t(this, 'autoExit', !0);
      t(this, 'onSuccess');
      t(this, 'onExit');
      t(this, 'onLoad');
      t(this, 'boundListenEvent');
      this.boundListenEvent = this.listen.bind(this);
    }
    listen(e) {
      if (e.origin === 'https://link.flexpa.com')
        switch (e.data.type) {
          case 'SUCCESS':
            this.close(), this.onSuccess && this.onSuccess(e.data.payload);
            break;
          case 'LOADED':
            this.onLoad && this.onLoad();
            break;
          case 'CLOSED':
            this.close(), this.onExit && this.onExit(e.data.payload);
            break;
        }
    }
    create(e) {
      Object.entries(e).forEach(([i, n]) => {
        this[i] = n;
      }),
        (this.targetUrl = this.buildTargetUrl());
    }
    open(e) {
      if (!this.publishableKey)
        throw new Error(
          'You must call `FlexpaLink.create(config)` before calling `FlexpaLink.open()`',
        );
      if (!this.iframe) {
        this.iframe = document.createElement('iframe');
        const i = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        border: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        z-index: 999999;`;
        (this.iframe.style.cssText = i),
          (this.iframe.allow = 'clipboard-write https://link.flexpa.com'),
          (this.iframe.src = this.buildTargetUrl(
            e == null ? void 0 : e.endpoint,
          ).toString()),
          (this.iframe.title = 'Flexpa Link'),
          document.body.appendChild(this.iframe),
          window.addEventListener('message', this.boundListenEvent);
      }
    }
    exit() {
      this.close(), this.onExit && this.onExit();
    }
    close() {
      this.iframe &&
        (document.body.removeChild(this.iframe),
        (this.iframe = void 0),
        window.removeEventListener('message', this.boundListenEvent));
    }
    buildTargetUrl(e) {
      if (!this.publishableKey) throw 'publishableKey required';
      if (!this.onSuccess) throw 'onSuccess required';
      const i = new URL('https://link.flexpa.com');
      return (
        i.searchParams.append('publishableKey', this.publishableKey),
        i.searchParams.append('openerUrl', window.location.href),
        i.searchParams.append('strict', this.strict ? 'true' : 'false'),
        i.searchParams.append('autoExit', this.autoExit ? 'true' : 'false'),
        e
          ? i.searchParams.append('endpoint', e)
          : this.endpoint && i.searchParams.append('endpoint', this.endpoint),
        this.user && i.searchParams.append('user', JSON.stringify(this.user)),
        i
      );
    }
  }
  const s = new a();
  return typeof window < 'u' && (window.FlexpaLink = s), s;
})();
