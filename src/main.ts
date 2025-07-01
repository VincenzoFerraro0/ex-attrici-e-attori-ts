
export type Person = {
    readonly id: number,
    readonly name: string,
    birth_year: number,
    death_year?: number,
    biography: string,
    image: string
}

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

export type Actress = Person & {
    most_famous_movies: [string, string, string],
    awards: string,
    nationality: ActressNationality,

}

// Crea una funzione getActress che, dato un id, effettua una chiamata a:

// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

export function isActress(dati: unknown): dati is Actress{
    return (
        typeof dati === 'object' && dati !== null &&
        "id" in dati && typeof  dati.id === 'number' &&
        "name" in dati && typeof dati.name === 'string' &&
        "birth_year" in dati && typeof dati.birth_year === 'number' &&
        "death_year" in dati && typeof dati.death_year === 'number' &&
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

export async function getActress(id:number): Promise<Actress | null>{
    try{
        const response = await fetch(`http://localhost:3333/actresses/${id}`)
        const dati: unknown= await response.json();
        if(!isActress(dati)){
            throw new Error('Formato dei dati non valido');
        }
        return dati;

    }catch(error){
        if(error instanceof Error){
            console.error('Errore durante il recupero dell\'attrice:', error)
        }else{
            console.error('errore sconosciuto:', error);
        }
        return null
    }
    
}