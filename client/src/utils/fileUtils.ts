import  ProfileStore  from '../store/profileStore';

export default class FileUtils {

    ALLOWED_FILE_FORMATS = ["jpg", "jpeg", "png"];
    MAX_FILE_SIZE = 512 * 1024

    private setShowButton: React.Dispatch<React.SetStateAction<boolean>> | undefined
    private profileStore: ProfileStore | undefined

    constructor(setShowButton: React.Dispatch<React.SetStateAction<boolean>> | undefined, profileStore: ProfileStore | undefined) {
        this.setShowButton = setShowButton;
        this.profileStore = profileStore;
    }

    isFileValid (file: File): boolean {
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split(".").pop();

        if (!fileExtension || !this.ALLOWED_FILE_FORMATS.includes(fileExtension)) {
            alert("Выберите файл в формате jpg, jpeg или png.");
            return false;
        }

        return true;
    };

    handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];

        if (file) {
            if (!this.isFileValid(file)) {
                return;
            }

            if (file.size > this.MAX_FILE_SIZE) {
            alert("Выберите файл размером менее 512 KB.");
            } else {
                if (this.setShowButton) {
                    this.setShowButton(false);
                }
                if (this.profileStore) {
                    this.profileStore.setSelectFile(file);
                }
            }
        }
    }

    readFileAsBase64(file: File): Promise<string>{
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }    
}
