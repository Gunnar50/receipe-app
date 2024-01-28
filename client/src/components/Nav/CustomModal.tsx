import { Modal } from "@mantine/core";

interface ModalProps extends React.PropsWithChildren {
	title: string;
	opened: boolean;
	close: () => void;
}

function CustomModal({ title, opened, close, children }: ModalProps) {
	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				title={title}
				styles={{
					title: { fontWeight: 600 },
				}}
				overlayProps={{
					backgroundOpacity: 0.55,
					blur: 2,
				}}
			>
				{children}
			</Modal>
		</>
	);
}

export default CustomModal;
