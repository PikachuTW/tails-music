import { useEffect, useState } from 'react';
import axios from 'axios';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/16/solid';

interface Song {
    id: number;
    name: string;
}

export default function MenuComponent() {
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await axios.get<Song[]>('/api/favorites');
                setSongs(res.data);
            } catch (err) {
                console.error('取得歌單失敗');
            }
        };
        fetchSongs();
    }, []);

    return (
        <ul className="menu bg-base-200 w-1/4 flex-nowrap overflow-y-auto">
            <li className="block">
                <details open>
                    <summary>你的收藏</summary>
                    <ul>
                        {songs.map((song, i) => (
                            <li key={i}>
                                <a
                                    className="block w-full truncate"
                                    title={song.name}>
                                    {song.name}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a>
                                <AdjustmentsHorizontalIcon className="size-4" />
                                管理歌單
                            </a>
                        </li>
                    </ul>
                </details>
            </li>
            <li className="block">
                <details open>
                    <summary>與你共用</summary>
                    <ul>
                        <li>
                            <a>
                                <AdjustmentsHorizontalIcon className="size-4"/>
                                管理共用
                            </a>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    );
}
