import "mocha";
import {expect} from 'chai';
import {generadorGPS} from '../src/gps';

describe('GPS tests', () => {
    it('El ejemplo del PDF funciona', () => {
        expect(generadorGPS(1, 14)).to.be.equal("11001000 001110");
    });
    it('El satélite 4 funciona', () => {
        expect(generadorGPS(4, 16)).to.be.equal("11111001 00111000 ");
    });
    it('El satélite 20 funciona. Longitud mayor', () => {
        expect(generadorGPS(20, 32)).to.be.equal("11110011 01001111 11111001 01011011 ");
    });
});