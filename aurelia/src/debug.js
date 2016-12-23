export class Debug {
  bindingContext = null;

  updateJson() {
    if (this.bindingContext === null) {
      this.json = 'null';
    } else if (this.bindingContext === undefined) {
      this.json = 'undefined'
    } else {
      // todo: use a stringify function that can handle circular references.
      this.json = JSON.stringify(this.bindingContext, null, 2);
    }
  }

  bind(bindingContext) {
    this.bindingContext = bindingContext;
    this.updateJson();
    this.interval = setInterval(this.updateJson, 150);
  }

  unbind() {
    this.bindingContext = null;
    clearInterval(this.interval);
  }
}