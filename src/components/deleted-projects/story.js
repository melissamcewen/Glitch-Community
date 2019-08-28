import React from 'react';
import { storiesOf } from '@storybook/react';
import DeletedProjects, { DeletedProjectsList } from './index';
import { provideContext } from '../../../stories/util';

const clickedUndelete = () => {
  alert('clicked undelete');
};

const deletedProjects = [
  { id: '5e980232-e99c-437d-8da4-9ecb224d8b0b', domain: 'tide-carver-deleted' },
  { id: '5e634397-64b2-4aca-a702-ded4ca2efc2e', domain: 'wry-rib-deleted' },
  { id: 'e5937b71-c7bb-4589-b447-2a2b8b7d6f3d', domain: 'lush-color-deleted' },
  { id: 'bcccb72f-d7ae-4c25-b1fd-3e1569a5f569', domain: 'shelled-larch-deleted' },
  { id: '9e1a4598-7f1a-4336-ad8a-01d9423fbff8', domain: 'actually-frill-deleted' },
  { id: '0a6b7bfc-e917-4a96-9e93-2b0f27a17c57', domain: 'scrawny-puffin-1-deleted' },
  { id: 'cb7e0697-3e83-4e4c-b5d2-d217f7589d4d', domain: 'square-salamander-deleted' },
  { id: 'f98317f9-70b8-424b-856a-17a01e2d22ec', domain: 'outstanding-tree-deleted' },
  { id: '3a2c6c33-a8dd-444c-8a03-b07886011153', domain: 'reflective-ship-deleted' },
  { id: 'ed30f670-77a7-4037-8375-76782b28ded5', domain: 'understood-plot-1-deleted' },
  { id: 'f9f1d17e-9602-41f8-abdc-f2996e900656', domain: 'few-burst-deleted' },
  { id: '3c6ae360-acac-4f1e-b8a5-207694d24373', domain: 'statuesque-father-deleted' },
  { id: '1ef919a7-6af4-43c8-b925-aff25f13781f', domain: 'stitch-close-deleted' },
  { id: 'f3890a3c-4c67-4376-b13d-bc1207ad05cb', domain: 'fertile-ruby-deleted' },
  { id: 'b60a2ae4-22da-4a05-a224-80ca29b3ab8c', domain: 'cheerful-flamingo-deleted-1' },
  { id: '66d842db-07f1-44e4-87fa-5bfcab9f52e7', domain: 'tourmaline-headlight-deleted' },
  { id: 'baafed5c-aa0b-48cb-aa72-8e20581bf483', domain: 'knowing-apology-deleted-1' },
  { id: '9e463705-1887-4ad8-b835-6dfb90f32e29', domain: 'melodious-fifth-deleted' },
  { id: '009c8aee-3dde-4a40-b939-78e0f365d22b', domain: 'materialistic-market-deleted' },
  { id: 'c44c5bf2-68d5-4e60-8c03-c48c4d464768', domain: 'silken-vinyl-deleted' },
  { id: '98404c29-a0eb-4f7d-a882-cf83539c185e', domain: 'incandescent-epoch-deleted' },
  { id: 'f5d15b1a-1bb3-4116-bf75-1eff9d93ea93', domain: 'ivy-creek-deleted' },
  { id: '9c673612-de22-48df-9c88-f5932c33540a', domain: 'witty-death-deleted' },
  { id: '9dcbd744-11d5-49cc-ac7d-961844198c48', domain: 'precious-slime-deleted' },
  { id: '1d1bde1a-25ce-4660-944c-eafe1aca474f', domain: 'misty-lawyer-deleted' },
  { id: '721cf55f-04ef-4011-9681-c197ff402b9d', domain: 'scandalous-larch-deleted-1' },
  { id: 'b1f9dbf0-a32d-43b9-800f-de2ec4e81b08', domain: 'sturdy-pancake-deleted' },
];

const mockAPI = {
  get: () => Promise.resolve({ data: [] }),
};

storiesOf('DeletedProjects', module)
  .add(
    'items',
    provideContext({}, () => (
      <div style={{ maxWidth: 960, margin: 20 }}>
        <DeletedProjectsList deletedProjects={deletedProjects} undelete={clickedUndelete} />
      </div>
    )),
  )
  .add(
    'container',
    provideContext({ api: mockAPI }, () => (
      <div style={{ maxWidth: 960, margin: 20 }}>
        <DeletedProjects
          deletedProjects={deletedProjects}
          setDeletedProjects={() => {
            console.log('set deleted projects');
          }}
          undelete={clickedUndelete}
        />
      </div>
    )),
  );
