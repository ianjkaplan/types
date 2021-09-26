import * as Schmervice from '@hapipal/schmervice';

export default class PaymentService extends Schmervice.Service {

    pay() {

        return 'success!';
    }
}

declare module '@hapipal/schmervice' {
    interface RegisteredServices {
        PaymentService: PaymentService;
    }
}
