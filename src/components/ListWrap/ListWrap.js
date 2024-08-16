import React, { useState, useEffect } from 'react';
import './ListWrap.css';

export const ListWrap = () => {
    const [charList, setCharList] = useState([]);   // combined list of characters & Continents
    const [outputList, setOutputList] = useState([]);   // filtered list to display

    const [filterTitleValue, setFilterTitleValue] = useState('');
    const [filterFamilyValue, setFilterFamilyValue] = useState('');
    const filterKeywordArr = [filterTitleValue, filterFamilyValue];

    let characters = [];
    let titleList = [];
    let familyList = [];

    if (charList.length > 0) {
        titleList = [...new Set(charList.map((item) => item.title))];
        familyList = [...new Set(charList.map((item) => item.family))];
    }

    const getSelectOptions = (list) => {
        return [<option value = {''} >--</option >, ...list.map((item) => <option value={item} >{item}</option>)];
    };

    const filterCharacters = (cList) => {
        if (!filterTitleValue && !filterFamilyValue) {
            setOutputList(cList);
        };
        if (filterTitleValue || filterFamilyValue) {
            const filteredArr = cList.filter((item) => (filterKeywordArr.includes(item.title) && item.title !== '') || (filterKeywordArr.includes(item.family) && item.family !== ''));
            console.log("==== filteredArr", filteredArr);
            setOutputList(filteredArr);
        }
    };

    const handleFilterTitleChange = (e) => {
        setFilterTitleValue(e.target.value);
    };

    const handleFilterFamilyChange = (e) => {
        setFilterFamilyValue(e.target.value);
    };

    const getContinentName = (dataArr = [], id = null) => {
        if (dataArr === null || dataArr === undefined || (typeof dataArr !== 'object' && dataArr.length === 0)) return 'no continent name';
        if (id !== 0) {
            if (id % 3 === 0 && id % 5 === 0) {
                return dataArr[3].name;
            }
            if (id % 3 === 0 || id % 5 === 0) {  // id is odd
                return dataArr[2].name;
            }
        }
        if (id === 0 || id % 2 === 0) {  // id is even
            return dataArr[0].name;
        }
        if (id === 1 || id !== 3 || id % 2 > 0) {
            return dataArr[1].name;
        }
    };

    const fetchCharacters = () => {
        fetch('https://thronesapi.com/api/v2/Characters')
        .then(response => response.json())
        .then(data => {
            characters = [...data];
        })
        .then(
            fetch('https://thronesapi.com/api/v2/Continents')
                .then(response => response.json())
                .then(data => {
                    const charData = characters.map((item) => {
                        return {
                            ...item,
                            'continentName': getContinentName(data, item.id),
                        };
                    });
                    // console.log("++ charData", charData);
                    setCharList(charData);
                    setOutputList(charData);
                })
                .catch(error => console.log(error))
        )
        .catch(error => console.log(error));
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    useEffect(() => {
        filterCharacters(charList);
    }, [filterKeywordArr[0], filterKeywordArr[1]]);

    return (
        <div>
            <div className='top-part'>
                <div>
                    {titleList.length > 0 && <div id='filterTitle'>
                        <p>Title: </p>
                        <select name='title' id='title' onChange={(e) => handleFilterTitleChange(e)}>
                            {getSelectOptions(titleList)}
                        </select>
                    </div>}
                </div>
                <div>
                    {familyList.length > 0 && <div id='filterFamily'>
                        <p>Family: </p>
                        <select name='family' id='family' onChange={(e) => handleFilterFamilyChange(e)}>
                            {getSelectOptions(familyList)}
                        </select>
                    </div>}
                </div>
            </div>
            <div className='bottom-part'>
                <ul>
                    {outputList && outputList.map((item) => <li key={item.id}>
                        {`${item.fullName} ${item.continentName}`}
                    </li>)}
                </ul>
            </div>
        </div>
    )
}
