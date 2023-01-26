import colors from '@/theme/colors';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRouterLoading } from 'src/hooks';

const SearchInput = () => {
	const [searchValue, setSearchValue] = useState<string>('');
	const router = useRouter();
	const isSearchLoading = useRouterLoading();

	const isHomePage = router.asPath === '/';

	const handleSubmit = () => {
		router.push(`/search?query=${searchValue}`);
	};

	const handleInputKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	};

	return (
		<FormControl
			sx={{ m: 1, width: '40ch' }}
			size={isHomePage ? 'medium' : 'small'}
		>
			<OutlinedInput
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				id="search-input"
				type="text"
				onKeyDown={handleInputKeys}
				endAdornment={
					<InputAdornment position="end">
						{isSearchLoading ? (
							<CircularProgress color="info" size={24} />
						) : (
							<IconButton
								aria-label="search for a movie"
								onClick={handleSubmit}
								onMouseDown={() => {}}
								edge="end"
								disabled={!searchValue}
							>
								<SearchIcon />
							</IconButton>
						)}
					</InputAdornment>
				}
				placeholder="Search"
				sx={{ bgcolor: colors.common.black }}
			/>
		</FormControl>
	);
};

export default SearchInput;
