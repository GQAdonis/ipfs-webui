import { a as useHelia, r as useExplore } from "./explore-DAWbd7Iy.js";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { jsx, jsxs } from "react/jsx-runtime";
//#region vendor/ipld-explorer-components/src/components/explore/spinner.svg
var spinner_default = "data:image/svg+xml,%3csvg%20width='120'%20height='30'%20viewBox='0%200%20120%2030'%20xmlns='http://www.w3.org/2000/svg'%20fill='%2369c4cd'%3e%3ccircle%20cx='15'%20cy='15'%20r='15'%3e%3canimate%20attributeName='r'%20from='15'%20to='15'%20begin='0s'%20dur='0.8s'%20values='15;9;15'%20calcMode='linear'%20repeatCount='indefinite'%20/%3e%3canimate%20attributeName='fill-opacity'%20from='1'%20to='1'%20begin='0s'%20dur='0.8s'%20values='1;.5;1'%20calcMode='linear'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3ccircle%20cx='60'%20cy='15'%20r='9'%20fill-opacity='0.3'%3e%3canimate%20attributeName='r'%20from='9'%20to='9'%20begin='0s'%20dur='0.8s'%20values='9;15;9'%20calcMode='linear'%20repeatCount='indefinite'%20/%3e%3canimate%20attributeName='fill-opacity'%20from='0.5'%20to='0.5'%20begin='0s'%20dur='0.8s'%20values='.5;1;.5'%20calcMode='linear'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3ccircle%20cx='105'%20cy='15'%20r='15'%3e%3canimate%20attributeName='r'%20from='15'%20to='15'%20begin='0s'%20dur='0.8s'%20values='15;9;15'%20calcMode='linear'%20repeatCount='indefinite'%20/%3e%3canimate%20attributeName='fill-opacity'%20from='1'%20to='1'%20begin='0s'%20dur='0.8s'%20values='1;.5;1'%20calcMode='linear'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3c/svg%3e";
//#endregion
//#region vendor/ipld-explorer-components/src/components/explore/upload.svg
var upload_default = "data:image/svg+xml,%3csvg%20width='120'%20height='30'%20viewBox='0%200%20120%2030'%20xmlns='http://www.w3.org/2000/svg'%20fill='%23edf0f4'%3e%3ccircle%20cx='15'%20cy='15'%20r='15'%3e%3c/circle%3e%3ccircle%20cx='60'%20cy='15'%20r='15'%20%3e%3c/circle%3e%3ccircle%20cx='105'%20cy='15'%20r='15'%3e%3c/circle%3e%3c/svg%3e";
//#endregion
//#region vendor/ipld-explorer-components/src/components/explore/IpldCarExploreForm.tsx
var IpldCarExploreForm = () => {
	const { t } = useTranslation("explore");
	const { doUploadUserProvidedCar } = useExplore();
	const { selectHeliaReady } = useHelia();
	const handleOnSubmit = (evt) => {
		evt.preventDefault();
	};
	const handleOnChange = useCallback((_evt) => {
		const imageFileLoader = document.getElementById("car-loader-image");
		if (imageFileLoader == null) {
			console.error("cannot find element with id \"car-loader-image\"");
			return;
		}
		imageFileLoader.src = spinner_default;
		const carFileInputEl = document.getElementById("car-file");
		if (carFileInputEl == null) {
			console.error("cannot find element with id \"car-file\"");
			return;
		}
		const selectedFile = carFileInputEl.files?.[0];
		if (selectedFile == null) {
			console.error("no file selected");
			return;
		}
		doUploadUserProvidedCar(selectedFile, upload_default);
	}, [doUploadUserProvidedCar]);
	return /* @__PURE__ */ jsx("form", {
		"data-id": "IpldCarExploreForm",
		className: "sans-serif black-80 flex",
		onSubmit: handleOnSubmit,
		encType: "multipart/form-data",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex-auto",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ jsx("input", {
						id: "car-file",
						type: "file",
						accept: ".car",
						className: "input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light focus-outline",
						style: {
							borderRadius: "3px 0 0 3px",
							backgroundColor: "white",
							padding: "5px 0px 5px 5px",
							width: "99%"
						},
						"aria-describedby": "name-desc",
						onChange: handleOnChange,
						disabled: !selectHeliaReady()
					}),
					/* @__PURE__ */ jsx("small", {
						id: "car-file-desc",
						className: "o-0 absolute f6 black-60 db mb2",
						children: t("IpldCarExploreForm.uploadCarFile")
					}),
					/* @__PURE__ */ jsx("img", {
						id: "car-loader-image",
						alt: "placeholder for upload and loader",
						src: upload_default,
						className: "absolute",
						style: {
							top: "0px",
							right: "0px",
							height: "30px",
							width: "30px",
							paddingRight: "10px"
						}
					})
				]
			})
		})
	});
};
//#endregion
export { IpldCarExploreForm as t };
