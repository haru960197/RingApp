import { Box, Button, FormControl, FormLabel, HStack, Input, List, ListItem, NumberInput, NumberInputField, Stack } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react"
import { UserSeetingsContext } from "../../Provider/UserSeetingsProvider";

type Props = {
	onSubmit: (title: string, ammount: number, date: Date) => void,
};

const RegisterForm: React.FC<Props> = (props) => {
	const [title, setTitle] = useState<string>("");
	const [ammount, setAmmount] = useState<number>(0);
	const [date, setDate] = useState<Date>(new Date());
	const [isMinus, setIsMinus] = useState<boolean>(false);
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

	const { userSettings } = useContext(UserSeetingsContext);
	const suggestions = userSettings.purposeSuggestions ?? [];
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleMinusClick = () => {
		setIsMinus((isMinus) => !isMinus);
		setAmmount((ammont) => -1 * ammont);
	}

	const handleNumberChange = (numStr: string) => {
		if (isMinus && ammount >= 0) {
			setAmmount(-1 * Number(numStr));
		} else {
			setAmmount(Number(numStr));
		}
	}

	const handleClick = (): void => {
		props.onSubmit(title, ammount, date);
		setTitle("");
		setAmmount(0);
		setDate(new Date());
		setIsMinus(false);
	}

	return (
		<Stack p={2} borderWidth={1} borderColor={"blue.600"}>
			<FormControl position="relative" ref={containerRef}>
				<FormLabel>用途</FormLabel>
				<Input
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
						setShowSuggestions(true);
					}}
					onFocus={() => setShowSuggestions(true)}
					onClick={() => setShowSuggestions(true)}
				/>
				{showSuggestions && suggestions.length > 0 && (
					<Box
						position="absolute"
						top="100%"
						left={0}
						right={0}
						zIndex={10}
						bg="white"
						borderWidth="1px"
						borderRadius="md"
						boxShadow="lg"
						mt={1}
						maxH="200px"
						overflowY="auto"
						borderColor="blue.600"
					>
						<List spacing={0}>
							{suggestions.map((suggestion, index) => (
								<ListItem
									key={index}
									px={4}
									py={2.5}
									cursor="pointer"
									_hover={{ bg: "blue.50", color: "blue.800" }}
									onClick={() => {
										setTitle(suggestion);
										setShowSuggestions(false);
									}}
									fontSize="sm"
									borderBottomWidth={index < suggestions.length - 1 ? "1px" : "0px"}
									borderColor="gray.100"
								>
									{suggestion}
								</ListItem>
							))}
						</List>
					</Box>
				)}
			</FormControl>

			<FormControl>
				<FormLabel>金額</FormLabel>
				<HStack w="100%">
					<Button
						onClick={handleMinusClick}
						bg={isMinus ? 'blue.300' : 'blue.50'}
						textColor={isMinus ? 'white' : 'black'}
						fontSize={'2xl'}
					>-</Button>
					<NumberInput
						w="100%"
						value={ammount}
						onChange={handleNumberChange}
						>
						<NumberInputField />
					</NumberInput>
					</HStack>
			</FormControl>

			<FormControl>
				<FormLabel>日付</FormLabel>
				<Input
					type={"date"}
					value={date.toLocaleDateString('sv-SE')}
					onChange={(e) => setDate(new Date(Date.parse(e.target.value)))}
				/>
			</FormControl>
			<HStack justifyContent={"end"} marginTop={2} marginBottom={1}>
				<Button
					colorScheme={"blue"}
					isDisabled={title === "" || ammount === 0}
					onClick={handleClick}
				>登録</Button>
			</HStack>
		</Stack>
	);
}

export default RegisterForm;