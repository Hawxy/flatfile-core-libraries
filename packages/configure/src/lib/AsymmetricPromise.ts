export class AsymmetricPromise {
  constructor(private resolve: () => {}, private reject: () => {}) {}
}
