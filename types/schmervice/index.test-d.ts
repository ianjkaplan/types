import * as Schmervice from '@hapipal/schmervice';
import * as Hapi from '@hapi/hapi';
import { expectAssignable, expectType } from 'tsd';
import { RegisteredServices, RegisterServiceConfiguration, Service} from '.';
import PaymentService from './services/payment';

// instantiate a hapi server
const server = Hapi.server();
server.register(Schmervice);

expectAssignable<symbol>(Schmervice.name);
expectAssignable<symbol>(Schmervice.sandbox);

server.registerService(PaymentService)
const { paymentService } = server.services();
expectType<Service>(paymentService)

expectType<void>(server.registerService({
    name: 'testServiceObject',
    myMethod: () => {}
}));

expectType<void>(server.registerService((server, options) => ({
    name: 'testServiceFactory',
    server,
    options
})));

expectType<void>(server.registerService({
    [Schmervice.name]: 'testServiceWithSymbols',
    [Schmervice.sandbox]: 'server',
    someMethod: () => {}
}));

expectType<void>(server.registerService([
    class ArrayServiceClass extends Schmervice.Service {
        someMethod() {}
    },
    {
        name: 'ArrayServiceObject',
        someMethod: () => {}
    }
]));

expectType<RegisterServiceConfiguration>(Schmervice.withName(
    'sandboxService',
    { sandbox: true },
    { method: () => {} }
))

expectType<void>(server.registerService(Schmervice.withName(
    'defaultOptionsService',
    {},
    () => {}
)));

server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {

        expectType<RegisteredServices>(req.server.services());
        expectType<RegisteredServices>(req.services());
        expectType<RegisteredServices>(h.services());
    }
})
