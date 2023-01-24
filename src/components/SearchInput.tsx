import colors from '@/theme/colors';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SearchInput = () => {
	const [searchValue, setSearchValue] = useState<string>('');
	const router = useRouter();

	const handleSubmit = () => {
		router.push(`/search?query=${searchValue}`);
	};

	const handleInputKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	};

	return (
		<FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
			<InputLabel htmlFor="search-input">Search for a movie</InputLabel>
			<OutlinedInput
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				id="search-input"
				type="text"
				onKeyDown={handleInputKeys}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="search for a movie"
							onClick={handleSubmit}
							onMouseDown={() => {}}
							edge="end"
						>
							<SearchIcon />
						</IconButton>
					</InputAdornment>
				}
				label="Search"
				sx={{ bgcolor: colors.common.black }}
			/>
		</FormControl>
	);
};

export default SearchInput;
