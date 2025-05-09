import {
    TaskBoardCard, TaskBoardCardProps,
    TaskBoardCardHeader, TaskBoardCardHeaderProps,
    TaskBoardCardBodyProps
} from '@progress/kendo-react-taskboard';

import { CardBody } from '@progress/kendo-react-layout';
import { cards } from '../../types/Cards';

const images: { [id: string]: string } = {};
cards.forEach(card => {
    images[String(card.id)] = card.image;
});

const CardHeaderComponent = (props: TaskBoardCardHeaderProps) => {
    return (
    <TaskBoardCardHeader
      {...props}
      title={props.task.description}
    />
    );
};

const CardBodyComponent = (props: TaskBoardCardBodyProps) => {
    return (
    <CardBody>
      <img
        src={images[String(props.task.id)]}
        style={{ height: '135px', width: '270px' }}
        alt={`KendoReact TaskBoard ${props.task.title}`}
        draggable={false}
      />
    </CardBody>
    );
};

export const Card = (props: TaskBoardCardProps) => {
    return (
    <TaskBoardCard
      {...props}
      cardHeader={CardHeaderComponent}
      cardBody={CardBodyComponent}
    />
    );
};
