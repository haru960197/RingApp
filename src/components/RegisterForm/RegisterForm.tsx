import { Button, FormControl, FormLabel, HStack, Input, NumberInput, NumberInputField, Stack } from "@chakra-ui/react";
import React, { useState } from "react"

type Props = {
	onSubmit: (title: string, ammount: number, date: Date) => void,
};

const RegisterForm: React.FC<Props> = (props) => {
	const [title, setTitle] = useState<string>("");
	const [ammount, setAmmount] = useState<number>(0);
	const [date, setDate] = useState<Date>(new Date());

	const handleClick = (): void => {
		props.onSubmit(title, ammount, date);
		setTitle("");
		setAmmount(0);
		setDate(new Date());
	}

	return (
		<Stack p={2} borderWidth={1} borderColor={"blue.600"}>
			<FormControl>
				<FormLabel>用途</FormLabel>
				<Input value={title} onChange={(e) => setTitle(e.target.value)} />
			</FormControl>

			<FormControl>
				<FormLabel>金額</FormLabel>
				<NumberInput
					value={ammount}
					onChange={(valueStr) => setAmmount(Number(valueStr))}
				>
					<NumberInputField />
				</NumberInput>
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