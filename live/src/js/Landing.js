import React, { Component } from "react";
import {
	GithubButton,
	Navbar,
	H1,
	H2,
	H4,
	Hero,
	ImageCard,
	GridLayout,
	Flex,
	Grid,
	Button,
	Text,
	Section,
	media
} from "@appbaseio/designkit";
import { Input, Form, Icon, Modal, Select, Tag, Button as AntButton } from "antd";
import { css, cx, injectGlobal } from "react-emotion";
import UrlParser from "url-parser-lite";
import { bool, arrayOf, object, string, func } from "prop-types";

import Footer from "./Footer";

const colors = {
	textPrimary: "#383E43",
	textSecondary: "#30373C"
};

const button = css({
	fontSize: 16,
	color: "white",
	background: "#0087FF",
	"&:hover, &:focus": {
		color: "white",
		background: "#0059A8"
	}
});

const input = css({
	fontSize: 14,
	marginBottom: '30px !important'
});

const featImage = css({
	[media('md')]: {
		maxWidth: 400,
		margin: '0 auto',
	},
});

const featImageReverse = css(featImage, {
	[media('md')]: {
		order: 1,
	},
});

// eslint-disable-next-line
injectGlobal`
	html {
		font-size: 16px;
	}
`;

const imgLink = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

// a new page but connections are still legacy
class Landing extends Component {
	state = {
		stars: "4,500",
		newApp: "",
		showModal: false,
	};

	componentDidMount() {
		fetch("https://api.github.com/repos/appbaseio/dejavu")
			.then(res => res.json())
			.then(json =>
				this.setState({
					stars: `${String(json.stargazers_count).slice(0, -3)},${String(
						json.stargazers_count
					).slice(-3)}`
				})
			);
		this.selectRef = React.createRef();
	}

	toggleModal = () => {
		this.setState(({ showModal }) => ({
			showModal: !showModal,
		}));
	}

	render() {
		const { stars, newApp, showModal } = this.state;
		const {
			apps,
			url,
			onUrlChange,
			indexUrl,
			fetchIndices,
			showFetchIndex,
			onAppSelect,
			onConnect,
			onAppNameChange
		} = this.props;
		return (
			<section
				css={{
					height: "100%",
					width: "100%",
					background: "white",
					position: "absolute",
					zIndex: 10,
					overflow: "auto",
					scrollBehavior: 'smooth',
				}}
			>
				<Navbar height="80px">
					<Navbar.Logo>
						<img
							src="live/assets/img/dejavu.svg"
							alt="Dejavu Logo"
							height="45px"
						/>
					</Navbar.Logo>
					<div css={{ "@media (max-width: 768px)": { display: "none" } }}>
						<GithubButton
							target="_blank"
							href="https://github.com/appbaseio/dejavu"
							label="View Dejavu on GitHub"
							shadow
							count={stars}
						/>
					</div>
				</Navbar>
				<Modal destroyOnClose visible={showModal} onCancel={this.toggleModal} footer={null} width={610}>
					<div css={{ marginTop: 20 }}>
						<iframe width="560" height="315" src="https://www.youtube.com/embed/qhDuRd2pJIY?rel=0&amp;showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullscreen />
					</div>
				</Modal>
				<Hero
					css={{
						minHeight: "100vh",
						background: "#FBFBFB",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: 'relative',
					}}
				>
					<Flex
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						css={{ height: "100%" }}
					>
						<H1
							css={{
								color: colors.textPrimary,
								fontSize: 52,
								marginBottom: 60,
								[media("md")]: { textAlign: "center", marginTop: 70 }
							}}
						>
							The missing web UI for Elasticsearch
						</H1>
						<div
							css={{
								display: "grid",
								gridTemplateColumns: "2fr 1fr",
								gridGap: 20,
								"@media (max-width: 768px)": { gridTemplateColumns: "1fr" }
							}}
						>
							<div
								css={{ padding: 50, borderRadius: 8, background: "#BFDDF9" }}
							>
								<Form>
									<Flex>
										<Input
											css={input}
											size="large"
											value={url}
											onChange={urlVal => {
												document.getElementById("gg-url").value = urlVal;
												onUrlChange(urlVal);
												setTimeout(() => {
													document.getElementById(
														"appname-aka-index"
													).value = newApp;
												}, 100);
											}}
											onBlur={() => fetchIndices(indexUrl)}
											placeholder="URL for cluster goes here. e.g. https://username:password@scalr.api.appbase.io"
										/>
										{showFetchIndex && (
											<AntButton
												size="large"
												icon="bars"
												css={{ marginLeft: 10 }}
												onClick={() => {
													fetchIndices(indexUrl);
													this.selectRef.current.focus();
												}}
											>
												Fetch Indices
											</AntButton>
										)}
									</Flex>
									<Select
										onSearch={appName => {
											this.setState({ newApp: appName });
											setTimeout(() => {
												document.getElementById(
													"appname-aka-index"
												).value = appName;
											}, 100);
										}}
										onChange={appName => {
											const appUrl = apps.find(app => app.appname === appName)
												.url;
											if (appUrl) {
												onAppSelect(appUrl);
											}
											this.setState({ newApp: appName });
											onAppNameChange(appName);
											setTimeout(() => {
												document.getElementById(
													"appname-aka-index"
												).value = appName;
											}, 100);
										}}
										ref={this.selectRef}
										showSearch
										css={input}
										size="large"
										placeholder="Appname (aka index) goes here"
										optionLabelProp="value"
									>
										{apps.find(app => app.appname === newApp)
											? null
											: newApp.length && (
													<Select.Option key={newApp}>{newApp}</Select.Option>
											  )}
										{apps.map(app => (
											<Select.Option key={app.appname}>
												<div
													css={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between"
													}}
												>
													{app.appname}
													<Tag css={{ fontSize: 12 }}>
														{UrlParser(app.url).host}
													</Tag>
												</div>
											</Select.Option>
										))}
									</Select>
									<Flex justifyContent="center">
										<Button
											onClick={onConnect}
											big
											uppercase
											shadow
											bold
											css={button}
										>
											Start Browsing
										</Button>
									</Flex>
								</Form>
							</div>
							<div
								css={{
									padding: 50,
									borderRadius: 8,
									border: "1px solid rgba(56,62,67,0.19)",
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<H2 css={{ fontSize: 28 }}>New to Dejavu?</H2>
								<div>
									<Button
										big
										uppercase
										shadow
										bold
										css={cx(
											button,
											css({
												marginBottom: 25
											})
										)}
										href="live?default=true"
										target="_blank"
									>
										Try a live demo
									</Button>
									<div onClick={this.toggleModal}>
										<Text
											css={{
												fontSize: 14,
												textTransform: "uppercase",
												fontWeight: 600,
												textAlign: "center",
												cursor: 'pointer',
											}}
											>
											<Icon type="play-circle-o" css={{ marginRight: 7 }} />
											Watch Video
										</Text>
									</div>
								</div>
							</div>
						</div>
					</Flex>
					<a
						css={{
							position: 'absolute',
							left: '50%',
							bottom: 25,
							cursor: 'pointer',
							[media('md')]: {
								display: 'none',
							},
						}}
						href="#landing-sections"
					>
						<Icon type="down" css={{ marginTop: 25, fontSize: "2rem" }} />
					</a>
				</Hero>
				<Section id="landing-sections">
					<div>
						<H2 css={{ marginBottom: 15 }}>Data Importer</H2>
						<H4>
							Bring data from your JSON or CSV files to Elasticsearch, and set
							data mappings with a guided process.
						</H4>
					</div>
					<img
						src="live/src/img/data-importer.png"
						alt="Data Importer GIF"
						width="100%"
						css={featImage}
					/>
				</Section>
				<Section background="#FBFBFB">
					<img
						src="live/src/img/data-browser.png"
						alt="Data Importer GIF"
						width="100%"
						css={featImageReverse}
					/>
					<div>
						<H2 css={{ marginBottom: 15 }}>Data Browser</H2>
						<H4>
							Browse your imported data, edit it, and add new fields. Create
							rich filtered and query views. Export data in JSON and CSV
							formats.
						</H4>
					</div>
				</Section>
				<Section>
					<div>
						<H2 css={{ marginBottom: 15 }}>Search Preview</H2>
						<H4>
							Create search UI and test search relevancy of your dataset with
							zero lines of code. Export the code to get a functional React web
							app.
						</H4>
					</div>
					<img
						src="live/src/img/search-sandbox.png"
						alt="Data Importer GIF"
						width="100%"
						css={featImage}
					/>
				</Section>
				<Section
					background="#FBFBFB"
					innerSectionProps={{
						columns: "1fr",
						className: css({
							flex: 1,
							fontFamily: '"Open Sans", sans-serif',
							h3: { fontWeight: "bold", marginTop: 15 }
						})
					}}
				>
					<div>
						<H2 center css={{ marginBottom: 15 }}>
							Browse Dejavu Datasets
						</H2>
						<H4 center>
							Browse the following public dejavu datasets, available in
							read-only formats. You can clone them to create your own
							Elasticsearch index.
						</H4>
					</div>
					<Grid size={4} mdSize={2} smSize={1} gutter="15px" smGutter="0px">
						<ImageCard
							title="Airbeds"
							description="A ~3,000 listings dataset for building an airbeds search."
							big
							src="live/assets/img/airbed.png"
							link="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAKLAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsW71dAzA7YYc-SS2NBdZOu2iiqUDTwzb8SRY-P60qxz_ZFKoJgMwEJushaRl-FxMxQqDCBLVG-xBlA5HfOZXDzUuGnntd_Zw9u4C0YdVJQ8HvMJrVO8AfQy73d9wq7TjySsVRv-NAKU5ZUw4jxU0ynrQflgPkDLN6AGDv4jeOi8Ir9BBSZ-bdv4J2oq7eCzLoC-gl9qTZsTRLHsXPhHvClG5we6nqctwdPgHqEWqj25nG0qo1RkmJYY_ZTF4XEJcMQyIw-2Rck0OE-ZTR7g8d3ste2uR2u9JbeJj9fjtjVNDltaQGN8jaAdUVVriYpB2CzgXN__Rv9tA"
							linkText="BROWSE"
						/>
						<ImageCard
							title="Hacker News"
							description="A Hacker News dataset of 6,000+ posts."
							big
							src="live/assets/img/technews.png"
							link="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAAIBAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsxYD52xAToBILCBZUHd4IWhGYOPRqt6o0DlIP1kVVIAmFVFSWIdk3E2cJl2oC_wC7YnoAXPLuLBSIxnd9d0TQ0opmWGwNYOHF30gMi0kIvl7AoiPzO_739ZQI7DS67rzkqlOcfTfQSkE7zipX4Ao9sYHB5yBaKA06JreaIPeE9HzCM5mgYRZ3XpfTFCMJKtlmtqnDnwvuxQb41PqmEQyqWkhmbbkM3A6Xwi4HB1SmUET_lJZAA"
							linkText="BROWSE"
						/>
						<ImageCard
							title="Movies"
							description="A TMDB derived dataset of 13,000 popular movies."
							big
							src="live/assets/img/movie.png"
							link="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAALHAQAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsl_X14MGM4ebXtwfc5RKh8oYUdlolmraYIijUHHIdsLNFR38QB36wFD9mxqQ3hw8UIuWk6anRkqRWWqJdQzL7fsaSb-KVmiJHfYd7IXvQwmbncmve1oOxVqeN5KsFHAvKApT4O8IzfYkBPNy7EkQSwChNYfGVnpSGneCa7C8pZFKIIs5ZN4AjAEnGcyF3fsKbh0s1SXrBiz9ZorBNHtj3Oue3UbKlLc5T07dvgh2dont93VHJExEarqodZLdySSzfl__Jb7qhfLatM1Iu9315nRu0sFK1YSCFWD4lYvqqcJc_NbJVfNB1cj2sMQUOaM6C8DubgTlaFaVIai7QiVvSWxMG8Mn5uvWDvLYJOZVG7Lu0gyOAouIsTpfyP_iQ_QA&editable=false"
							linkText="BROWSE"
						/>
						<ImageCard
							title="Add your dataset"
							description="Submit your own dataset to our public gallery."
							big
							src="live/assets/img/dataset.png"
							link="https://github.com/appbaseio/dejavu/issues/new?template=dataset.md"
							linkText="SUBMIT"
						/>
					</Grid>
					<GridLayout
						css={{ maxWidth: 600, margin: "0 auto" }}
						gridTemplateColumns="repeat(3, auto)"
						gridGap={40}
						justifyContent="center"
						justifyItems="center"
						alignItems="center"
					>
						<a css={imgLink} href="https://chrome.google.com/webstore/detail/dejavu/jopjeaiilkcibeohjdmejhoifenbnmlh" target="_blank" rel="noopener noreferrer">
							<img
								src="live/assets/img/chromestore.png"
								alt="Chrome Store"
								width="70%"
							/>
						</a>
						<Button css={button} shadow uppercase bold href="live?default=true">
							Try Live
						</Button>
						<a css={imgLink} href="https://hub.docker.com/r/appbaseio/dejavu/" target="_blank" rel="noopener noreferrer">
							<img src="live/assets/img/docker.png" alt="Docker" width="70%" />
						</a>
					</GridLayout>
				</Section>
				<Footer />
			</section>
		);
	}
}

Landing.propTypes = {
	apps: arrayOf(object),
	url: string,
	onUrlChange: func,
	indexUrl: string,
	fetchIndices: func,
	showFetchIndex: bool,
	onAppSelect: func,
	onConnect: func,
	onAppNameChange: func
};

export default Landing;
