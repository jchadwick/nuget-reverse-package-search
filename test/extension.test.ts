import * as assert from 'assert';
import * as mockery from 'mockery';
import { Disposable } from 'vscode';

suite("Extension Tests", () => {

    let vscode, extension, context;

    suiteSetup(() => {
        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);

        vscode = {
            commands: {
                registerCommand: (commandName, activationAction) => <Disposable> {
                    commandName,
                    activate: activationAction,
                    dispose: () => { /* NOOP */ },
                },
            },
        };

        mockery.registerMock("vscode", vscode);
    });

    setup(() => {
        context = {
            subscriptions: [],
        };

        extension = require("../src/extension");
    });

    suiteTeardown(() => {
        mockery.disable();
    });

    test("should activate", (done) => {

        let activation = extension.activate(context);

        assert.equal(!!activation, true);

        done();
    });

    test("should register command", (done) => {

        extension.activate(context);

        assert.equal(!!context.subscriptions.length, true);

        done();
    });

});
