import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(0);
    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsListLoaded);
    }
    
    const onComicsListLoaded = (data) => {
        let ended = false
        if(data.length < 8) {
            ended = true;
        }
        setComicsEnded(ended);
        setOffset(offset + 8);
        setNewItemLoading(newItemLoading => false);
        setComicsList([...comicsList, ...data]);
    } 
    


    const renderItems = () => {

        const items = comicsList.map((item, i) => {
            const {title, id, thumbnail, price} = item;
            
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price > 0 ? `${price}$` : price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems();
    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;


    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
                className="button button__main button__long"
                onClick={() => onRequest(offset)}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                disabled={newItemLoading}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;