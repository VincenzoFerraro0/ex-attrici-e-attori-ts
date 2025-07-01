// Tipo base: rappresenta una persona
export type Person = {
    readonly id: number,         // Identificativo univoco (immutabile)
    readonly name: string,       // Nome completo (immutabile)
    birth_year: number,          // Anno di nascita
    death_year?: number,         // Anno di morte (facoltativo)
    biography: string,           // Biografia della persona
    image: string                // URL dell'immagine
}

// Tipo ristretto per le nazionalità possibili delle attrici
export type ActressNationality =
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South"
    | "African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese"

// Tipo Actress che estende Person con proprietà specifiche
export type Actress = Person & {
    most_famous_movies: [string, string, string], // Esattamente tre film famosi
    awards: string,                               // Premi ricevuti
    nationality: ActressNationality,              // Nazionalità (ristretta ai valori sopra)
}

// Type guard: verifica che un oggetto sia del tipo Actress
export function isActress(dati: unknown): dati is Actress {
    return (
        typeof dati === 'object' && dati !== null &&
        "id" in dati && typeof dati.id === 'number' &&
        "name" in dati && typeof dati.name === 'string' &&
        "birth_year" in dati && typeof dati.birth_year === 'number' &&
        "death_year" in dati && typeof dati.death_year === 'number' && // Permette anche undefined
        "biography" in dati && typeof dati.biography === 'string' &&
        "image" in dati && typeof dati.image === 'string' &&
        "most_famous_movies" in dati &&
        dati.most_famous_movies instanceof Array &&
        dati.most_famous_movies.length === 3 &&
        dati.most_famous_movies.every(m => typeof m === 'string') &&
        "awards" in dati && typeof dati.awards === 'string' &&
        "nationality" in dati && typeof dati.nationality === 'string'
    )
}

// Funzione asincrona per ottenere una singola attrice tramite ID
export async function getActress(id: number): Promise<Actress | null> {
    try {
        const response = await fetch(`http://localhost:3333/actresses/${id}`)
        const dati: unknown = await response.json();

        // Controlla che i dati ricevuti abbiano la struttura corretta
        if (!isActress(dati)) {
            throw new Error('Formato dei dati non valido');
        }

        return dati; // Dati validi, restituisce l'oggetto Actress
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante il recupero dell\'attrice:', error);
        } else {
            console.error('Errore sconosciuto:', error);
        }
        return null; // In caso di errore, restituisce null
    }
}

// Funzione per recuperare tutte le attrici
export async function getAllActress(): Promise<Actress[]> {
    try {
        const response = await fetch(`http://localhost:3333/actresses`)

        // Controlla che la risposta HTTP sia valida
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }

        const dati: unknown = await response.json();

        // Verifica che i dati siano un array
        if (!(dati instanceof Array)) {
            throw new Error('Formato dei dati non valido: non è un array');
        }

        // Filtra solo gli oggetti che rispettano la struttura Actress
        const attriciValide = dati.filter(isActress);
        return attriciValide;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Errore durante il recupero delle attrici:', error);
        } else {
            console.error('Errore sconosciuto:', error);
        }
        return []; // In caso di errore, restituisce un array vuoto
    }
}

// Funzione per recuperare un array di attrici dato un array di ID
export async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
    try {
        // Mappa ogni ID alla chiamata API corrispondente usando getActress
        const promises = ids.map(id => getActress(id));

        // Esegue tutte le chiamate in parallelo con Promise.all
        const actresses = await Promise.all(promises);

        // Restituisce l'array di risultati (alcuni possono essere null)
        return actresses;
    } catch (error) {
        // Gestione dell'errore generico
        if (error instanceof Error) {
            console.error('Errore durante il recupero delle attrici:', error);
        } else {
            console.error('Errore sconosciuto:', error);
        }

        // In caso di errore globale, restituisce un array vuoto
        return [];
    }
}