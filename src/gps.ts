/**
 *  SEGURIDAD EN SISTEMAS INFORMÁTICOS
 *  Práctica 4: Generador C/A de GPS
 * Autor: Adrián González Hernández
 * Email: alu0101216775@ull.edu.es
 */

/**
 * Esta función genera la tabla con los diferentes satélites que puede utilizar el generador C/A de GPS.
 * Para ello, utiliza un map. La clave será el número del satélite, y el valor un array que contiene las dos posiciones utilizadas del registro.
 * @returns {Map<number, number[]} La tabla con las posiciones de los satélites
 */
function generateTable(): Map<number, number[]> {
    let map: Map<number, number[]> = new Map();
    map.set(1, [2,6]);
    map.set(2, [3,7]);
    map.set(3, [4,8]);
    map.set(4, [5,9]);
    map.set(5, [1,9]);
    map.set(6, [2,10]);
    map.set(7, [1,8]);
    map.set(8, [2,9]);
    map.set(9, [3,10]);
    map.set(10, [2,3]);
    map.set(11, [3,4]);
    map.set(12, [5,6]);
    map.set(13, [6,7]);
    map.set(14, [7,8]);
    map.set(15, [8,9]);
    map.set(16, [9,10]);
    map.set(17, [1,4]);
    map.set(18, [2,5]);
    map.set(19, [3,6]);
    map.set(20, [4,7]);
    map.set(21, [5,8]);
    map.set(22, [6,9]);
    map.set(23, [1,3]);
    map.set(24, [4,6]);
    map.set(25, [5,7]);
    map.set(26, [6,8]);
    map.set(27, [7,9]);
    map.set(28, [8,10]);
    map.set(29, [1,6]);
    map.set(30, [2,7]);
    map.set(31, [3,8]);
    map.set(32, [4,9]);
    return map;
}

/**
 * Consulta la tabla para obtener las posiciones correspondientes al satélite elegido
 * @param sat ID del satélite a utilizar
 * @param map Tabla en la que se consultará las posiciones
 * @returns {number[]} El array con las coordenadas del satélite
 */
function checkSat(sat: number, map: Map<number, number[]>): number[] {
    return map.get(sat)!;
}

/**
 * Función que permite hacer un xor de dos valores booleanos. Se ha hecho de esta forma para ahorrar recursos y evitar tener que estar realizando conversiones de tipo continuamente.
 * @param x 
 * @param y 
 * @returns El resultado del xor como booleano
 */
function xor2(x: boolean, y: boolean) {
    if(x && y) return false;
    else if(x || y) return true;
    else return false;
}

/**
 * Función que permite hacer un xor de cualquier número de parámetros booleanos recibido
 * @param param 
 * @returns El resultado del xor como booleano
 */
function xorMult(...param: boolean[]): boolean {
    let countTrue: number = 0;
    //Itera todos los parámetros recibidos con un foreach
    param.forEach(element => {
        if(element) countTrue++;
    });
    if(countTrue % 2 === 0) return false;
    return true;
}

/**
 * Gestiona el desplazamiento completo del registro A, es decir, el que genera G1
 * @param reg 
 * @returns {boolean[]} La copia del registro con el correspondiente desplazamiento aplicado
 */
function shiftA(reg: boolean[]): boolean[] {
    let tmp: boolean = false;
    let tmpreg: boolean[] = [];
    //Crea una copia del registro
    reg.forEach(element => {
        tmpreg.push(element);
    });
    //realiza el xor que decidirá que valor entra
    tmp = xor2(reg[2], reg[9]);
    //Desplaza el registro
    for (let i = 1; i < 10; i++) {
        tmpreg[i] = reg[i - 1];
    }
    //Asigna el nuevo primer valor del registro
    tmpreg[0] = tmp;
    return tmpreg;
}

/**
 * Gestiona el desplazamiento completo del registro B, es decir, el que genera G2
 * @param reg 
 * @returns {boolean[]} La copia del registro con el correspondiente desplazamiento aplicado
 */
function shiftB(reg: boolean[]): boolean[] {
    let tmp: boolean = false;
    let tmpreg: boolean[] = [];
    //Crea una copia del registro
    reg.forEach(element => {
        tmpreg.push(element);
    });
    //realiza el xor que decidirá que valor entra
    tmp = xorMult(reg[1], reg[2], reg[5], reg[7], reg[8], reg[9]);
    //Desplaza el registro
    for (let i = 1; i < 10; i++) {
        tmpreg[i] = reg[i - 1];
    }
    //Asigna el nuevo primer valor del registro
    tmpreg[0] = tmp;
    return tmpreg;
}

/**
 * Función principal del programa. Controla el flujo del generador y retorna el valor final, además de mostrarlo por consola.
 * @param sat ID del satélite a utilizar
 * @param it Número de iteraciones deseadas. Si no se indica, se usa el valor por defecto, 1024
 * @returns {string} Cadena de 0 y 1 resultado
 */
export function generadorGPS(sat: number, it: number = 1024): string {
    let registroA: boolean[] = [true,true,true,true,true,true,true,true,true,true];
    let registroB: boolean[] = [true,true,true,true,true,true,true,true,true,true];
    let map: Map<number, number[]> = generateTable();
    let coor: number[] = checkSat(sat, map);
    let result: boolean[] = [];
    let g1: boolean, g2: boolean;
    for (let i = 0; i < it; i++) {
        //Asigna los valores de g1 y g2
        g1 = registroA[9];
        g2 = xor2(registroB[coor[0] - 1], registroB[coor[1] - 1]);
        //Guarda el XOR de g1 y g2 en la siguiente posición del vector resultado
        result.push(xor2(g1,g2));
        //Desplaza los registros
        registroA = shiftA(registroA);
        registroB = shiftB(registroB);
    }
    let stringResult: string = "";
    //Convierte los booleanos a 0 y 1 para mostrarse por pantalla. Se divide en bloques de 8 bits para facilitar su comprensión.
    for (let i = 0; i < it; i++) {
        if(result[i]) stringResult += "1";
        else stringResult += "0";

        if((i + 1) % 8 === 0) stringResult += " ";
    }
    console.log(stringResult);
    return stringResult;
}