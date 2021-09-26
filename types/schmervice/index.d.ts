// Definitely Typed Definitions by Tim Costa <https://github.com/timcosta>
import { Plugin, Server, ServerOptionsCache, ServerMethodOptions } from '@hapi/hapi';

export const name: unique symbol;
export const sandbox: unique symbol;

export interface ServiceCachingOptions {
    [methodNameToCache: string]: ServerOptionsCache | Exclude<ServerMethodOptions, 'bind'>;
}

export type ServiceSandbox = boolean | 'plugin' | 'server';

export interface ServiceRegistrationObject {
    caching?: ServiceCachingOptions | undefined;
    name?: string | undefined;
    [name]?: string | undefined;
    [sandbox]?: ServiceSandbox | undefined;
    // any is necessary here as implementation is left to the developers
    // without this member the tests fail as the Schmervice.withName factory
    // has no members in common with this interface
    [serviceMethod: string]: any;
}

export function ServiceFactory(server: Server, options?: object): ServiceRegistrationObject;

// options is any because it's left to the implementer to define based on usage
export type ServiceOptions = any;

export class Service {
    static caching: ServiceCachingOptions;
    static [name]: string;
    static [sandbox]: ServiceSandbox;
    server: Server;
    options: ServiceOptions;
    constructor(server: Server, options: ServiceOptions);
    // object matches https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/hapi__hapi/index.d.ts#L3104
    // null matches else case in schmervice
    get context(): object | null;
    caching(options: ServiceCachingOptions): void;
    bind(): this;
    initialize?(): void;
    teardown?(): void;
}

export type RegisterServiceConfiguration = (typeof ServiceFactory | Service | Service[] | ServiceRegistrationObject);

export const plugin: Plugin<{}>;

export interface WithNameOptions {
    sandbox?: ServiceSandbox | undefined;
}

// TS takes issue with this function signature (name, [options], serviceFactory) due to a required param
// following an optional param. The best solution short of changing the library appears to be to just
// make options a required parameter that people can set to {}
export function withName(name: string, options: WithNameOptions, serviceFactory: RegisterServiceConfiguration): RegisterServiceConfiguration;


// allows service definitions to optionally "register" themselves as types that will be returned
// by using typescript declaration merging with interfaces
export interface RegisteredServices {
    [key: string]: Service;
}

// decorates hapi server with services
declare module '@hapi/hapi' {
    interface Server {
        registerService: (config: RegisterServiceConfiguration) => void;

        /**
         * decorations can be passed a plugin namespace or a boolean to return all registered services
         * @link https://hapipal.com/docs/schmervice#serverservicesnamespace
         * @param all
         */
        services: (all?: true | string) => RegisteredServices;
    }

    interface Request {
        services: (all?: true | string) => RegisteredServices;
    }

    interface ResponseToolkit {
        services: (all?: true | string) => RegisteredServices;
    }
}