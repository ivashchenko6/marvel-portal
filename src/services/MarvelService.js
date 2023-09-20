import { useHttp } from "../hooks/http.hook";

;
const useMarvelService = () => {
    const {loading, error, request, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = `apikey=07f21a4f186bb1f17acb7084a665fbd7`;
    const _baseOffset = 210;


    const getAllCharacters = async (offset = _baseOffset) => { //Получения всех персонажей 

        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }


    const getCharacter = async (id) => { //Получения одного персонажа

        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }


    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const _transformCharacter = (char) => { //Улучшение вида данных. В res приходит массив данных
        const {name, description, thumbnail, urls, id, comics} = char;

        
        return {
            id: id,
            name: name,
            description:  description ? `${description.slice(0, 210)}...`: 'There is no description for this character',
            thumbnail: `${thumbnail.path}.${thumbnail.extension}`,
            homepage: urls[0].url,
            wiki: urls[1].url,
            comics: comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
    }


    return {loading, error, getAllCharacters, getAllComics, getCharacter, clearError, getComic, getCharacterByName};
}


export default useMarvelService;