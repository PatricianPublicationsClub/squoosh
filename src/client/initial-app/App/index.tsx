import type { FileDropEvent } from 'file-drop-element';
import type SnackBarElement from 'client/initial-app/custom-els/snack-bar';
import type { SnackOptions } from 'client/initial-app/custom-els/snack-bar';

import { h, Component } from 'preact';

import { linkRef } from 'client/initial-app/util';
import * as style from './style.css';
import 'file-drop-element';
import 'client/initial-app/custom-els/snack-bar';
//import Intro from '../intro';
import 'client/initial-app/custom-els/loading-spinner';

const ROUTE_EDITOR = '/editor';

//const compressPromise = import('../compress');
//const swBridgePromise = import('../../lib/sw-bridge');

function back() {
  window.history.back();
}

interface Props {}

interface State {
  awaitingShareTarget: boolean;
  file?: File;
  isEditorOpen: Boolean;
  Compress?: undefined; // typeof import('../compress').default;
}

export default class App extends Component<Props, State> {
  state: State = {
    awaitingShareTarget: new URL(location.href).searchParams.has(
      'share-target',
    ),
    isEditorOpen: false,
    file: undefined,
    Compress: undefined,
  };

  snackbar?: SnackBarElement;

  constructor() {
    super();

    /*compressPromise
      .then((module) => {
        this.setState({ Compress: module.default });
      })
      .catch(() => {
        this.showSnack('Failed to load app');
      });

    swBridgePromise.then(async ({ offliner, getSharedImage }) => {
      offliner(this.showSnack);
      if (!this.state.awaitingShareTarget) return;
      const file = await getSharedImage();
      // Remove the ?share-target from the URL
      history.replaceState('', '', '/');
      this.openEditor();
      this.setState({ file, awaitingShareTarget: false });
    });*/

    // Since iOS 10, Apple tries to prevent disabling pinch-zoom. This is great in theory, but
    // really breaks things on Squoosh, as you can easily end up zooming the UI when you mean to
    // zoom the image. Once you've done this, it's really difficult to undo. Anyway, this seems to
    // prevent it.
    document.body.addEventListener('gesturestart', (event) => {
      event.preventDefault();
    });

    window.addEventListener('popstate', this.onPopState);
  }

  private onFileDrop = ({ files }: FileDropEvent) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    this.openEditor();
    this.setState({ file });
  };

  private onIntroPickFile = (file: File) => {
    this.openEditor();
    this.setState({ file });
  };

  private showSnack = (
    message: string,
    options: SnackOptions = {},
  ): Promise<string> => {
    if (!this.snackbar) throw Error('Snackbar missing');
    return this.snackbar.showSnackbar(message, options);
  };

  private onPopState = () => {
    this.setState({ isEditorOpen: location.pathname === ROUTE_EDITOR });
  };

  private openEditor = () => {
    if (this.state.isEditorOpen) return;
    // Change path, but preserve query string.
    const editorURL = new URL(location.href);
    editorURL.pathname = ROUTE_EDITOR;
    history.pushState(null, '', editorURL.href);
    this.setState({ isEditorOpen: true });
  };

  render(
    {}: Props,
    { file, isEditorOpen, Compress, awaitingShareTarget }: State,
  ) {
    const showSpinner = awaitingShareTarget || (isEditorOpen && !Compress);

    return (
      <div class={style.app}>
        <file-drop
          accept="image/*"
          onfiledrop={this.onFileDrop}
          class={style.drop}
        >
          {showSpinner ? (
            <loading-spinner class={style.appLoader} />
          ) : isEditorOpen ? (
            Compress &&
            //<Compress file={file!} showSnack={this.showSnack} onBack={back} />
            'TODO: uncomment above'
          ) : (
            //<Intro onFile={this.onIntroPickFile} showSnack={this.showSnack} />
            'TODO: show intro here'
          )}
          <snack-bar ref={linkRef(this, 'snackbar')} />
        </file-drop>
      </div>
    );
  }
}
