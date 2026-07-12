declare namespace Spicetify {
	type Icon =
		| "addToPlaylist"
		| "addToQueue"
		| "album"
		| "artist"
		| "block"
		| "brightness"
		| "car"
		| "chart-down"
		| "chart-up"
		| "check"
		| "check-alt-fill"
		| "chevron-left"
		| "chevron-right"
		| "chromecast-disconnected"
		| "clock"
		| "collapseLibrary"
		| "collaborative"
		| "computer"
		| "connectDevice"
		| "copy"
		| "create"
		| "credits"
		| "download"
		| "downloaded"
		| "edit"
		| "enhance"
		| "enterFullScreen"
		| "exclamation-circle"
		| "excludeTaste"
		| "expandLibrary"
		| "external-link"
		| "facebook"
		| "follow"
		| "friendActivity"
		| "fullscreen"
		| "gamepad"
		| "goToAlbum"
		| "goToArtist"
		| "grid-view"
		| "heart"
		| "heart-active"
		| "heartAdd"
		| "instagram"
		| "laptop"
		| "library"
		| "list-view"
		| "location"
		| "locked"
		| "locked-active"
		| "lyrics"
		| "menu"
		| "minimize"
		| "miniplayer"
		| "minus"
		| "more"
		| "new-spotify-connect"
		| "nowPlaying"
		| "offline"
		| "openDesktop"
		| "pause"
		| "phone"
		| "play"
		| "playlist"
		| "playlist-folder"
		| "plus-alt"
		| "plus2px"
		| "podcasts"
		| "projector"
		| "queue"
		| "radio"
		| "repeat"
		| "repeat-once"
		| "search"
		| "search-active"
		| "share"
		| "shuffle"
		| "skip-back"
		| "skip-back15"
		| "skip-forward"
		| "skip-forward15"
		| "skipBack"
		| "skipForward"
		| "smartShuffle"
		| "soundbetter"
		| "speaker"
		| "spotify"
		| "subtitles"
		| "tablet"
		| "ticket"
		| "twitter"
		| "visualizer"
		| "voice"
		| "volume"
		| "volume-off"
		| "volume-one-wave"
		| "volumeHigh"
		| "volume-two-wave"
		| "watch"
		| "whatsNew"
		| "x";
	type Variant =
		| "bass"
		| "forte"
		| "brio"
		| "altoBrio"
		| "alto"
		| "canon"
		| "celloCanon"
		| "cello"
		| "ballad"
		| "balladBold"
		| "viola"
		| "violaBold"
		| "mesto"
		| "mestoBold"
		| "metronome"
		| "finale"
		| "finaleBold"
		| "minuet"
		| "minuetBold";
	type SemanticColor =
		| "textBase"
		| "textSubdued"
		| "textBrightAccent"
		| "textNegative"
		| "textWarning"
		| "textPositive"
		| "textAnnouncement"
		| "essentialBase"
		| "essentialSubdued"
		| "essentialBrightAccent"
		| "essentialNegative"
		| "essentialWarning"
		| "essentialPositive"
		| "essentialAnnouncement"
		| "decorativeBase"
		| "decorativeSubdued"
		| "backgroundBase"
		| "backgroundHighlight"
		| "backgroundPress"
		| "backgroundElevatedBase"
		| "backgroundElevatedHighlight"
		| "backgroundElevatedPress"
		| "backgroundTintedBase"
		| "backgroundTintedHighlight"
		| "backgroundTintedPress"
		| "backgroundUnsafeForSmallTextBase"
		| "backgroundUnsafeForSmallTextHighlight"
		| "backgroundUnsafeForSmallTextPress";
	type ColorSet =
		| "base"
		| "brightAccent"
		| "negative"
		| "warning"
		| "positive"
		| "announcement"
		| "invertedDark"
		| "invertedLight"
		| "mutedAccent"
		| "overMedia";
	type ColorSetBackgroundColors = {
		base: string;
		highlight: string;
		press: string;
	};
	type ColorSetNamespaceColors = {
		announcement: string;
		base: string;
		brightAccent: string;
		negative: string;
		positive: string;
		subdued: string;
		warning: string;
	};
	type ColorSetBody = {
		background: ColorSetBackgroundColors & {
			elevated: ColorSetBackgroundColors;
			tinted: ColorSetBackgroundColors;
			unsafeForSmallText: ColorSetBackgroundColors;
		};
		decorative: {
			base: string;
			subdued: string;
		};
		essential: ColorSetNamespaceColors;
		text: ColorSetNamespaceColors;
	};
	type Metadata = Partial<Record<string, string>>;
	type ContextTrack = {
		uri: string;
		uid?: string;
		metadata?: Metadata;
	};
	type PlayerState = {
		timestamp: number;
		context: PlayerContext;
		index: PlayerIndex;
		item: PlayerTrack;
		shuffle: boolean;
		smartShuffle: boolean;
		repeat: number;
		speed: number;
		positionAsOfTimestamp: number;
		duration: number;
		hasContext: boolean;
		isPaused: boolean;
		isBuffering: boolean;
		restrictions: Restrictions;
		previousItems?: PlayerTrack[];
		nextItems?: PlayerTrack[];
		playbackQuality: PlaybackQuality;
		playbackId: string;
		sessionId: string;
		signals?: any[];
	};
	type PlayerContext = {
		uri: string;
		url: string;
		metadata: {
			"player.arch": string;
		};
	};
	type PlayerIndex = {
		pageURI?: string | null;
		pageIndex: number;
		itemIndex: number;
	};
	type PlayerTrack = {
		type: string;
		uri: string;
		uid: string;
		name: string;
		mediaType: string;
		duration: {
			milliseconds: number;
		};
		album: Album;
		artists?: ArtistsEntity[];
		isLocal: boolean;
		isExplicit: boolean;
		is19PlusOnly: boolean;
		provider: string;
		metadata: TrackMetadata;
		images?: ImagesEntity[];
	};
	type TrackMetadata = {
		artist_uri: string;
		entity_uri: string;
		iteration: string;
		title: string;
		"collection.is_banned": string;
		"artist_uri:1": string;
		"collection.in_collection": string;
		image_small_url: string;
		"collection.can_ban": string;
		is_explicit: string;
		album_disc_number: string;
		album_disc_count: string;
		track_player: string;
		album_title: string;
		"canvas.artist.avatar": string;
		"canvas.artist.name": string;
		"canvas.artist.uri": string;
		"canvas.canvasUri": string;
		"canvas.entityUri": string;
		"canvas.explicit": string;
		"canvas.fileId": string;
		"canvas.id": string;
		"canvas.type": string;
		"canvas.uploadedBy": string;
		"canvas.url": string;
		"collection.can_add": string;
		image_large_url: string;
		"actions.skipping_prev_past_track": string;
		page_instance_id: string;
		image_xlarge_url: string;
		marked_for_download: string;
		"actions.skipping_next_past_track": string;
		context_uri: string;
		"artist_name:1": string;
		has_lyrics: string;
		interaction_id: string;
		image_url: string;
		album_uri: string;
		album_artist_name: string;
		album_track_number: string;
		artist_name: string;
		duration: string;
		album_track_count: string;
		popularity: string;
		associated_video_id: string;
		video_association: string;
		video_association_image: string;
		video_association_image_height: string;
		video_association_image_height_large: string;
		video_association_image_height_xxlarge: string;
		video_association_image_large: string;
		video_association_image_width: string;
		video_association_image_width_large: string;
		video_association_image_width_xxlarge: string;
		video_association_image_xxlarge: string;
		[key: string]: string;
	};
	type Album = {
		type: string;
		uri: string;
		name: string;
		images?: ImagesEntity[];
	};
	type ImagesEntity = {
		url: string;
		label: string;
	};
	type ArtistsEntity = {
		type: string;
		uri: string;
		name: string;
	};
	type Restrictions = {
		canPause: boolean;
		canResume: boolean;
		canSeek: boolean;
		canSkipPrevious: boolean;
		canSkipNext: boolean;
		canToggleRepeatContext: boolean;
		canToggleRepeatTrack: boolean;
		canToggleShuffle: boolean;
		disallowPausingReasons?: string[];
		disallowResumingReasons?: string[];
		disallowSeekingReasons?: string[];
		disallowSkippingPreviousReasons?: string[];
		disallowSkippingNextReasons?: string[];
		disallowTogglingRepeatContextReasons?: string[];
		disallowTogglingRepeatTrackReasons?: string[];
		disallowTogglingShuffleReasons?: string[];
		disallowTransferringPlaybackReasons?: string[];
	};
	type PlaybackQuality = {
		bitrateLevel: number;
		strategy: number;
		targetBitrateLevel: number;
		targetBitrateAvailable: boolean;
		hifiStatus: number;
	};
	namespace Player {

		const origin: any;

		function addEventListener(type: string, callback: (event?: Event) => void): void;
		function addEventListener(type: "songchange", callback: (event?: Event & { data: PlayerState }) => void): void;
		function addEventListener(type: "onplaypause", callback: (event?: Event & { data: PlayerState }) => void): void;
		function addEventListener(type: "onprogress", callback: (event?: Event & { data: number }) => void): void;
		function addEventListener(
			type: "appchange",
			callback: (
				event?: Event & {
					data: {

						path: string;

						container: HTMLElement;
					};
				}
			) => void
		): void;

		function back(): void;

		const data: PlayerState;

		function decreaseVolume(): void;

		function dispatchEvent(event: Event): void;
		const eventListeners: {
			[key: string]: Array<(event?: Event) => void>;
		};

		function formatTime(milisecond: number): string;

		function getDuration(): number;

		function getMute(): boolean;

		function getProgress(): number;

		function getProgressPercent(): number;

		function getRepeat(): number;

		function getShuffle(): boolean;

		function getHeart(): boolean;

		function getVolume(): number;

		function increaseVolume(): void;

		function isPlaying(): boolean;

		function next(): void;

		function pause(): void;

		function play(): void;

		function playUri(uri: string, context?: any, options?: any): Promise<void>;

		function removeEventListener(type: string, callback: (event?: Event) => void): void;

		function seek(position: number): void;

		function setMute(state: boolean): void;

		function setRepeat(mode: number): void;

		function setShuffle(state: boolean): void;

		function setVolume(level: number): void;

		function skipBack(amount?: number): void;

		function skipForward(amount?: number): void;

		function toggleHeart(): void;

		function toggleMute(): void;

		function togglePlay(): void;

		function toggleRepeat(): void;

		function toggleShuffle(): void;
	}

	function addToQueue(uri: ContextTrack[]): Promise<void>;

	const BridgeAPI: any;

	const CosmosAPI: any;

	namespace CosmosAsync {
		type Method = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "SUB";
		interface Error {
			code: number;
			error: string;
			message: string;
			stack?: string;
		}

		type Headers = Record<string, string>;
		type Body = Record<string, any>;

		interface Response {
			body: any;
			headers: Headers;
			status: number;
			uri?: string;
		}

		function head(url: string, headers?: Headers): Promise<Headers>;
		function get(url: string, body?: Body, headers?: Headers): Promise<Response["body"]>;
		function post(url: string, body?: Body, headers?: Headers): Promise<Response["body"]>;
		function put(url: string, body?: Body, headers?: Headers): Promise<Response["body"]>;
		function del(url: string, body?: Body, headers?: Headers): Promise<Response["body"]>;
		function patch(url: string, body?: Body, headers?: Headers): Promise<Response["body"]>;
		function sub(
			url: string,
			callback: (b: Response["body"]) => void,
			onError?: (e: Error) => void,
			body?: Body,
			headers?: Headers
		): Promise<Response["body"]>;
		function postSub(
			url: string,
			body: Body | null,
			callback: (b: Response["body"]) => void,
			onError?: (e: Error) => void
		): Promise<Response["body"]>;
		function request(method: Method, url: string, body?: Body, headers?: Headers): Promise<Response>;
		function resolve(method: Method, url: string, body?: Body, headers?: Headers): Promise<Response>;
	}

	function colorExtractor(uri: string): Promise<{
		DARK_VIBRANT: string;
		DESATURATED: string;
		LIGHT_VIBRANT: string;
		PROMINENT: string;
		VIBRANT: string;
		VIBRANT_NON_ALARMING: string;
	}>;

	function getAblumArtColors(): any;

	function getAudioData(uri?: string): Promise<any>;

	namespace Keyboard {
		type ValidKey =
			| "BACKSPACE"
			| "TAB"
			| "ENTER"
			| "SHIFT"
			| "CTRL"
			| "ALT"
			| "CAPS"
			| "ESCAPE"
			| "SPACE"
			| "PAGE_UP"
			| "PAGE_DOWN"
			| "END"
			| "HOME"
			| "ARROW_LEFT"
			| "ARROW_UP"
			| "ARROW_RIGHT"
			| "ARROW_DOWN"
			| "INSERT"
			| "DELETE"
			| "A"
			| "B"
			| "C"
			| "D"
			| "E"
			| "F"
			| "G"
			| "H"
			| "I"
			| "J"
			| "K"
			| "L"
			| "M"
			| "N"
			| "O"
			| "P"
			| "Q"
			| "R"
			| "S"
			| "T"
			| "U"
			| "V"
			| "W"
			| "X"
			| "Y"
			| "Z"
			| "WINDOW_LEFT"
			| "WINDOW_RIGHT"
			| "SELECT"
			| "NUMPAD_0"
			| "NUMPAD_1"
			| "NUMPAD_2"
			| "NUMPAD_3"
			| "NUMPAD_4"
			| "NUMPAD_5"
			| "NUMPAD_6"
			| "NUMPAD_7"
			| "NUMPAD_8"
			| "NUMPAD_9"
			| "MULTIPLY"
			| "ADD"
			| "SUBTRACT"
			| "DECIMAL_POINT"
			| "DIVIDE"
			| "F1"
			| "F2"
			| "F3"
			| "F4"
			| "F5"
			| "F6"
			| "F7"
			| "F8"
			| "F9"
			| "F10"
			| "F11"
			| "F12"
			| ";"
			| "="
			| " | "
			| "-"
			| "."
			| "/"
			| "`"
			| "["
			| "\\"
			| "]"
			| '"'
			| "~"
			| "!"
			| "@"
			| "#"
			| "$"
			| "%"
			| "^"
			| "&"
			| "*"
			| "("
			| ")"
			| "_"
			| "+"
			| ":"
			| "<"
			| ">"
			| "?"
			| "|";
		type KeysDefine =
			| string
			| {
					key: string;
					ctrl?: boolean;
					shift?: boolean;
					alt?: boolean;
					meta?: boolean;
			  };
		const KEYS: Record<ValidKey, string>;
		function registerShortcut(keys: KeysDefine, callback: (event: KeyboardEvent) => void): void;
		function registerIsolatedShortcut(keys: KeysDefine, callback: (event: KeyboardEvent) => void): void;
		function registerImportantShortcut(keys: KeysDefine, callback: (event: KeyboardEvent) => void): void;
		function _deregisterShortcut(keys: KeysDefine): void;
		function deregisterImportantShortcut(keys: KeysDefine): void;
		function changeShortcut(keys: KeysDefine, newKeys: KeysDefine): void;
	}

	const LiveAPI: any;

	namespace LocalStorage {

		function clear(): void;

		function get(key: string): string | null;

		function remove(key: string): void;

		function set(key: string, value: string): void;
	}

	namespace Menu {

		class Item {
			constructor(name: string, isEnabled: boolean, onClick: (self: Item) => void, icon?: Icon | string);
			name: string;
			isEnabled: boolean;

			setName(name: string): void;

			setState(isEnabled: boolean): void;

			setIcon(icon: Icon | string): void;

			register(): void;

			deregister(): void;
		}

		class SubMenu {
			constructor(name: string, subItems: Item[]);
			name: string;

			setName(name: string): void;

			addItem(item: Item): void;

			removeItem(item: Item): void;

			register(): void;

			deregister(): void;
		}
	}

	function Mousetrap(element?: any): void;

	const Platform: any;

	const Queue: {
		nextTracks: any[];
		prevTracks: any[];
		queueRevision: string;
		track: any;
	};

	function removeFromQueue(uri: ContextTrack[]): Promise<void>;

	function showNotification(message: React.ReactNode, isError?: boolean, msTimeout?: number): void;

	class URI {
		constructor(type: string, props: any);
		public type: string;
		public hasBase62Id: boolean;

		public id?: string;
		public disc?: any;
		public args?: any;
		public category?: string;
		public username?: string;
		public track?: string;
		public artist?: string;
		public album?: string;
		public duration?: number;
		public query?: string;
		public country?: string;
		public global?: boolean;
		public context?: string | typeof URI | null;
		public anchor?: string;
		public play?: any;
		public toplist?: any;

		toURI(): string;

		toString(): string;

		toURLPath(opt_leadingSlash: boolean): string;

		toURL(origin?: string): string;

		clone(): URI | null;

		getPath(): string;

		static Type: {
			AD: string;
			ALBUM: string;
			GENRE: string;
			QUEUE: string;
			APPLICATION: string;
			ARTIST: string;
			ARTIST_TOPLIST: string;
			ARTIST_CONCERTS: string;
			AUDIO_FILE: string;
			COLLECTION: string;
			COLLECTION_ALBUM: string;
			COLLECTION_ARTIST: string;
			COLLECTION_MISSING_ALBUM: string;
			COLLECTION_TRACK_LIST: string;
			CONCERT: string;
			CONTEXT_GROUP: string;
			DAILY_MIX: string;
			EMPTY: string;
			EPISODE: string;

			FACEBOOK: string;
			FOLDER: string;
			FOLLOWERS: string;
			FOLLOWING: string;
			IMAGE: string;
			INBOX: string;
			INTERRUPTION: string;
			LIBRARY: string;
			LIVE: string;
			ROOM: string;
			EXPRESSION: string;
			LOCAL: string;
			LOCAL_TRACK: string;
			LOCAL_ALBUM: string;
			LOCAL_ARTIST: string;
			MERCH: string;
			MOSAIC: string;
			PLAYLIST: string;
			PLAYLIST_V2: string;
			PRERELEASE: string;
			PROFILE: string;
			PUBLISHED_ROOTLIST: string;
			RADIO: string;
			ROOTLIST: string;
			SEARCH: string;
			SHOW: string;
			SOCIAL_SESSION: string;
			SPECIAL: string;
			STARRED: string;
			STATION: string;
			TEMP_PLAYLIST: string;
			TOPLIST: string;
			TRACK: string;
			TRACKSET: string;
			USER_TOPLIST: string;
			USER_TOP_TRACKS: string;
			UNKNOWN: string;
			MEDIA: string;
			QUESTION: string;
			POLL: string;
		};

		static fromString(str: string): URI;

		static from(value: any): URI | null;

		static isSameIdentity(baseUri: URI | string, refUri: URI | string): boolean;

		static idToHex(id: string): string;

		static hexToId(hex: string): string;

		static albumURI(id: string, disc: number): URI;

		static applicationURI(id: string, args: string[]): URI;

		static artistURI(id: string): URI;

		static collectionURI(username: string, category: string): URI;

		static collectionAlbumURI(username: string, id: string): URI;

		static collectionAlbumURI(username: string, id: string): URI;

		static concertURI(id: string): URI;

		static episodeURI(id: string): URI;

		static folderURI(id: string): URI;

		static localAlbumURI(artist: string, album: string): URI;

		static localArtistURI(artist: string): URI;

		static playlistV2URI(id: string): URI;

		static prereleaseURI(id: string): URI;

		static profileURI(username: string, args: string[]): URI;

		static searchURI(query: string): URI;

		static showURI(id: string): URI;

		static stationURI(args: string[]): URI;

		static trackURI(id: string, anchor: string, context?: string, play?: boolean): URI;

		static userToplistURI(username: string, toplist: string): URI;

		static isAd(uri: URI | string): boolean;
		static isAlbum(uri: URI | string): boolean;
		static isGenre(uri: URI | string): boolean;
		static isQueue(uri: URI | string): boolean;
		static isApplication(uri: URI | string): boolean;
		static isArtist(uri: URI | string): boolean;
		static isArtistToplist(uri: URI | string): boolean;
		static isArtistConcerts(uri: URI | string): boolean;
		static isAudioFile(uri: URI | string): boolean;
		static isCollection(uri: URI | string): boolean;
		static isCollectionAlbum(uri: URI | string): boolean;
		static isCollectionArtist(uri: URI | string): boolean;
		static isCollectionMissingAlbum(uri: URI | string): boolean;
		static isCollectionTrackList(uri: URI | string): boolean;
		static isConcert(uri: URI | string): boolean;
		static isContextGroup(uri: URI | string): boolean;
		static isDailyMix(uri: URI | string): boolean;
		static isEmpty(uri: URI | string): boolean;
		static isEpisode(uri: URI | string): boolean;
		static isFacebook(uri: URI | string): boolean;
		static isFolder(uri: URI | string): boolean;
		static isFollowers(uri: URI | string): boolean;
		static isFollowing(uri: URI | string): boolean;
		static isImage(uri: URI | string): boolean;
		static isInbox(uri: URI | string): boolean;
		static isInterruption(uri: URI | string): boolean;
		static isLibrary(uri: URI | string): boolean;
		static isLive(uri: URI | string): boolean;
		static isRoom(uri: URI | string): boolean;
		static isExpression(uri: URI | string): boolean;
		static isLocal(uri: URI | string): boolean;
		static isLocalTrack(uri: URI | string): boolean;
		static isLocalAlbum(uri: URI | string): boolean;
		static isLocalArtist(uri: URI | string): boolean;
		static isMerch(uri: URI | string): boolean;
		static isMosaic(uri: URI | string): boolean;
		static isPlaylist(uri: URI | string): boolean;
		static isPlaylistV2(uri: URI | string): boolean;
		static isPrerelease(uri: URI | string): boolean;
		static isProfile(uri: URI | string): boolean;
		static isPublishedRootlist(uri: URI | string): boolean;
		static isRadio(uri: URI | string): boolean;
		static isRootlist(uri: URI | string): boolean;
		static isSearch(uri: URI | string): boolean;
		static isShow(uri: URI | string): boolean;
		static isSocialSession(uri: URI | string): boolean;
		static isSpecial(uri: URI | string): boolean;
		static isStarred(uri: URI | string): boolean;
		static isStation(uri: URI | string): boolean;
		static isTempPlaylist(uri: URI | string): boolean;
		static isToplist(uri: URI | string): boolean;
		static isTrack(uri: URI | string): boolean;
		static isTrackset(uri: URI | string): boolean;
		static isUserToplist(uri: URI | string): boolean;
		static isUserTopTracks(uri: URI | string): boolean;
		static isUnknown(uri: URI | string): boolean;
		static isMedia(uri: URI | string): boolean;
		static isQuestion(uri: URI | string): boolean;
		static isPoll(uri: URI | string): boolean;
		static isPlaylistV1OrV2(uri: URI | string): boolean;
	}

	namespace ContextMenu {
		type OnClickCallback = (uris: string[], uids?: string[], contextUri?: string) => void;
		type ShouldAddCallback = (uris: string[], uids?: string[], contextUri?: string) => boolean;

		class Item {

			static readonly iconList: Icon[];
			constructor(name: string, onClick: OnClickCallback, shouldAdd?: ShouldAddCallback, icon?: Icon, disabled?: boolean);
			name: string;
			icon: Icon | string;
			disabled: boolean;

			shouldAdd: ShouldAddCallback;

			onClick: OnClickCallback;

			register: () => void;

			deregister: () => void;
		}

		class SubMenu {
			constructor(name: string, subItems: Iterable<Item>, shouldAdd?: ShouldAddCallback, disabled?: boolean);
			name: string;
			disabled: boolean;

			shouldAdd: ShouldAddCallback;
			addItem: (item: Item) => void;
			removeItem: (item: Item) => void;

			register: () => void;

			deregister: () => void;
		}
	}

	namespace PopupModal {
		interface Content {
			title: string;

			content: string | Element | React.JSX.Element;

			isLarge?: boolean;
		}

		function display(e: Content): void;
		function hide(): void;
	}

	const React: any;

	const ReactDOM: any;

	const ReactDOMServer: any;

	const ReactJSX: any;

	namespace ReactComponent {
		type ContextMenuProps = {

			renderInline?: boolean;

			trigger?: "click" | "right-click";

			action?: "toggle" | "open";

			placement?:
				| "top"
				| "top-start"
				| "top-end"
				| "right"
				| "right-start"
				| "right-end"
				| "bottom"
				| "bottom-start"
				| "bottom-end"
				| "left"
				| "left-start"
				| "left-end";

			offset?: [number, number];

			preventScrollingWhileOpen?: boolean;

			menu:
				| typeof Spicetify.ReactComponent.Menu
				| typeof Spicetify.ReactComponent.AlbumMenu
				| typeof Spicetify.ReactComponent.PodcastShowMenu
				| typeof Spicetify.ReactComponent.ArtistMenu
				| typeof Spicetify.ReactComponent.PlaylistMenu;

			children: Element | ((isOpen?: boolean, handleContextMenu?: (e: MouseEvent) => void, ref?: (e: Element) => void) => Element);
		};
		type MenuProps = {

			onClose?: () => void;

			getInitialFocusElement?: (el: HTMLElement | null) => HTMLElement | undefined | null;
		};
		type MenuItemProps = {

			onClick?: React.MouseEventHandler<HTMLButtonElement>;

			disabled?: boolean;

			divider?: "before" | "after" | "both";

			icon?: React.ReactNode;

			leadingIcon?: React.ReactNode;

			trailingIcon?: React.ReactNode;
		};
		type TooltipProps = {

			label: string | React.ReactNode;

			children: React.ReactNode;

			renderInline?: boolean;

			showDelay?: number;

			disabled?: boolean;

			placement?:
				| "top"
				| "top-start"
				| "top-end"
				| "right"
				| "right-start"
				| "right-end"
				| "bottom"
				| "bottom-start"
				| "bottom-end"
				| "left"
				| "left-start"
				| "left-end";

			labelClassName?: string;
		};
		type IconComponentProps = {

			iconSize?: number;

			color?: string;

			semanticColor?: SemanticColor;

			title?: string;

			titleId?: string;

			desc?: string;

			descId?: string;

			autoMirror?: boolean;
		};
		type TextComponentProps = {

			color?: string;

			semanticColor?: SemanticColor;

			variant?: Variant;

			paddingBottom?: string;

			weight?: "book" | "bold" | "black";
		};
		type ConfirmDialogProps = {

			isOpen?: boolean;

			allowHTML?: boolean;

			titleText: string;

			descriptionText?: string;

			confirmText?: string;

			cancelText?: string;

			confirmLabel?: string;

			onConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void;

			onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;

			onOutside?: (event: React.MouseEvent<HTMLButtonElement>) => void;
		};
		type SliderProps = {

			labelText?: string;

			value: number;

			min: number;

			max: number;

			step: number;

			isInteractive?: boolean;

			forceActiveStyles?: boolean;

			onDragStart: (value: number) => void;

			onDragMove: (value: number) => void;

			onDragEnd: (value: number) => void;

			onStepForward?: () => void;

			onStepBackward?: () => void;
		};
		type ButtonProps = {
			component: any;

			colorSet?: ColorSet;

			buttonSize?: "sm" | "md" | "lg";

			size?: "small" | "medium" | "large";

			fullWidth?: any;

			iconLeading?: (props: any) => any | string;

			iconTrailing?: (props: any) => any | string;

			iconOnly?: (props: any) => any | string;

			className?: string;

			"aria-label"?: string;

			"aria-labelledby"?: string;

			UNSAFE_colorSet?: ColorSetBody;
			onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
			onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
			onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
			onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
			onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void;
			onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
			onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
		};

		const ContextMenu: any;

		const RightClickMenu: any;

		const Menu: any;

		const MenuItem: any;

		const AlbumMenu: any;
		const PodcastShowMenu: any;
		const ArtistMenu: any;
		const PlaylistMenu: any;
		const TrackMenu: any;

		const TooltipWrapper: any;

		const IconComponent: any;

		const TextComponent: any;

		const ConfirmDialog: any;

		const Slider: any;

		const ButtonPrimary: any;

		const ButtonSecondary: any;

		const ButtonTertiary: any;
	}

	namespace Topbar {
		class Button {
			constructor(label: string, icon: Icon | string, onClick: (self: Button) => void, disabled?: boolean, isRight?: boolean);
			label: string;
			icon: string;
			onClick: (self: Button) => void;
			disabled: boolean;
			isRight: boolean;
			element: HTMLButtonElement;
			tippy: any;
		}
	}

	namespace Playbar {

		class Button {
			constructor(
				label: string,
				icon: Icon | string,
				onClick?: (self: Button) => void,
				disabled?: boolean,
				active?: boolean,
				registerOnCreate?: boolean
			);
			label: string;
			icon: string;
			onClick: (self: Button) => void;
			disabled: boolean;
			active: boolean;
			element: HTMLButtonElement;
			tippy: any;
			register: () => void;
			deregister: () => void;
		}

		class Widget {
			constructor(
				label: string,
				icon: Icon | string,
				onClick?: (self: Widget) => void,
				disabled?: boolean,
				active?: boolean,
				registerOnCreate?: boolean
			);
			label: string;
			icon: string;
			onClick: (self: Widget) => void;
			disabled: boolean;
			active: boolean;
			element: HTMLButtonElement;
			tippy: any;
			register: () => void;
			deregister: () => void;
		}
	}

	const SVGIcons: Record<Icon, string>;

	namespace Config {
		const version: string;
		const current_theme: string;
		const color_scheme: string;
		const extensions: string[];
		const custom_apps: string[];
	}

	const Tippy: any;

	const TippyProps: any;

	namespace AppTitle {

		function set(title: string): Promise<{ clear: () => void }>;

		function reset(): Promise<void>;

		function get(): Promise<string>;

		function sub(callback: (title: string) => void): { clear: () => void };
	}

	namespace GraphQL {

		type Query =
			| "decorateItemsForEnhance"
			| "imageURLAndSize"
			| "imageSources"
			| "audioItems"
			| "creator"
			| "extractedColors"
			| "extractedColorsAndImageSources"
			| "fetchExtractedColorAndImageForAlbumEntity"
			| "fetchExtractedColorAndImageForArtistEntity"
			| "fetchExtractedColorAndImageForEpisodeEntity"
			| "fetchExtractedColorAndImageForPlaylistEntity"
			| "fetchExtractedColorAndImageForPodcastEntity"
			| "fetchExtractedColorAndImageForTrackEntity"
			| "fetchExtractedColorForAlbumEntity"
			| "fetchExtractedColorForArtistEntity"
			| "fetchExtractedColorForEpisodeEntity"
			| "fetchExtractedColorForPlaylistEntity"
			| "fetchExtractedColorForPodcastEntity"
			| "fetchExtractedColorForTrackEntity"
			| "getAlbumNameAndTracks"
			| "getEpisodeName"
			| "getTrackName"
			| "queryAlbumTrackUris"
			| "queryTrackArtists"
			| "decorateContextEpisodesOrChapters"
			| "decorateContextTracks"
			| "fetchTracksForRadioStation"
			| "decoratePlaylists"
			| "playlistUser"
			| "FetchPlaylistMetadata"
			| "playlistContentsItemTrackArtist"
			| "playlistContentsItemTrackAlbum"
			| "playlistContentsItemTrack"
			| "playlistContentsItemLocalTrack"
			| "playlistContentsItemEpisodeShow"
			| "playlistContentsItemEpisode"
			| "playlistContentsItemResponse"
			| "playlistContentsItem"
			| "FetchPlaylistContents"
			| "episodeTrailerUri"
			| "podcastEpisode"
			| "podcastMetadataV2"
			| "minimalAudiobook"
			| "audiobookChapter"
			| "audiobookMetadataV2"
			| "fetchExtractedColors"
			| "queryFullscreenMode"
			| "queryNpvEpisode"
			| "queryNpvArtist"
			| "albumTrack"
			| "getAlbum"
			| "queryAlbumTracks"
			| "queryArtistOverview"
			| "queryArtistAppearsOn"
			| "discographyAlbum"
			| "albumMetadataReleases"
			| "albumMetadata"
			| "queryArtistDiscographyAlbums"
			| "queryArtistDiscographySingles"
			| "queryArtistDiscographyCompilations"
			| "queryArtistDiscographyAll"
			| "queryArtistDiscographyOverview"
			| "artistPlaylist"
			| "queryArtistPlaylists"
			| "queryArtistDiscoveredOn"
			| "queryArtistFeaturing"
			| "queryArtistRelated"
			| "queryArtistMinimal"
			| "searchModalResults"
			| "queryWhatsNewFeed"
			| "whatsNewFeedNewItems"
			| "SetItemsStateInWhatsNewFeed"
			| "browseImageURLAndSize"
			| "browseImageSources"
			| "browseAlbum"
			| "browseArtist"
			| "browseEpisode"
			| "browseChapter"
			| "browsePlaylist"
			| "browsePodcast"
			| "browseAudiobook"
			| "browseTrack"
			| "browseUser"
			| "browseMerch"
			| "browseArtistConcerts"
			| "browseContent"
			| "browseSectionContainer"
			| "browseClientFeature"
			| "browseItem"
			| "browseAll"
			| "browsePage";

		const Definitions: Record<Query | string, any>;

		function Request(query: (typeof Definitions)[Query | string], variables?: Record<string, any>, context?: Record<string, any>): Promise<any>;

		const Context: Record<string, any>;

		function Handler(
			context: Record<string, any>
		): (query: (typeof Definitions)[Query | string], variables?: Record<string, any>, context?: Record<string, any>) => Promise<any>;
	}

	namespace ReactHook {

		function DragHandler(
			uris?: string[],
			label?: string,
			contextUri?: string,
			sectionIndex?: number,
			dropOriginUri?: string
		): (event: React.DragEvent, uris?: string[], label?: string, contextUri?: string, sectionIndex?: number) => void;

		function useExtractedColor(uri: string, fallbackColor?: string, variant?: "colorRaw" | "colorLight" | "colorDark"): string;
	}

	namespace ReactFlipToolkit {
		const Flipper: any;
		const Flipped: any;
		const spring: any;
	}

	function classnames(...args: any[]): string;

	const ReactQuery: any;

	function extractColorPreset(image: string | string[]): Promise<
		{
			colorRaw: Color;
			colorLight: Color;
			colorDark: Color;
			isFallback: boolean;
		}[]
	>;

	interface hsl {
		h: number;
		s: number;
		l: number;
	}
	interface hsv {
		h: number;
		s: number;
		v: number;
	}
	interface rgb {
		r: number;
		g: number;
		b: number;
	}
	type CSSColors = "HEX" | "HEXA" | "HSL" | "HSLA" | "RGB" | "RGBA";

	class Color {
		constructor(rgb: rgb, hsl: hsl, hsv: hsv, alpha?: number);

		static BLACK: Color;
		static WHITE: Color;
		static CSSFormat: Record<CSSColors, number> & Record<number, CSSColors>;

		a: number;
		hsl: hsl;
		hsv: hsv;
		rgb: rgb;

		static fromCSS(cssColor: string, alpha?: number): Color;
		static fromHSL(hsl: hsl, alpha?: number): Color;
		static fromHSV(hsv: hsv, alpha?: number): Color;
		static fromRGB(rgb: rgb, alpha?: number): Color;
		static fromHex(hex: string, alpha?: number): Color;

		contrastAdjust(against: Color, strength?: number): Color;

		stringify(): string;

		toCSS(colorFormat: number): string;

		toString(): string;
	}

	namespace Locale {

		const _relativeTimeFormat: Intl.RelativeTimeFormat | null;

		const _dateTimeFormats: Record<string, Intl.DateTimeFormat>;

		const _locale: string;
		const _urlLocale: string;

		const _supportedLocales: Record<string, string>;

		const _dictionary: Record<string, string | { one: string; other: string }>;

		function formatDate(date: number | Date | undefined, options?: Intl.DateTimeFormatOptions): string;

		function formatRelativeTime(date: number | Date | undefined, options?: Intl.DateTimeFormatOptions): string;

		function formatNumber(number: number, options?: Intl.NumberFormatOptions): string;

		function formatNumberCompact(number: number): string;

		function get(key: string, ...children: React.ReactNode[]): string | React.ReactNode;

		function getDateTimeFormat(options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;

		function getDictionary(): Record<string, string | { one: string; other: string }>;

		function getLocale(): string;

		function getSmartlingLocale(): string;

		function getUrlLocale(): string;

		function getRelativeTimeFormat(): Intl.RelativeTimeFormat;

		function getSeparator(): string;

		function setLocale(locale: string): void;

		function setUrlLocale(locale: string): void;

		function setDictionary(dictionary: Record<string, string | { one: string; other: string }>): void;

		function toLocaleLowerCase(text: string): string;

		function toLocaleUpperCase(text: string): string;
	}
}
